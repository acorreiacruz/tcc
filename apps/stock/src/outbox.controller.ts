import { Controller, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import StockOutboxRepositoryDatabase from "./infraestructure/repository/stockOutboxRepositoryDatabase";
import { connect, Channel } from "amqplib";

@Controller("outbox")
export class OutboxController {
    private readonly logger = new Logger(OutboxController.name);
    private channel: Channel;
    private exchange: string;
    private receivers: Map<string, string>;

    constructor(
        private readonly stockOutboxRepository: StockOutboxRepositoryDatabase
    ) {
        this.initializeRabbitMQ();
        this.exchange = "stock.exchange";
        this.receivers = new Map();
        this.receivers.set("stock_reserved", "stock.reserved.rk");
        this.receivers.set("stock_confirmed", "stock.confirmed.rk");
        this.receivers.set("stock_released", "stock.released.rk");
    }

    private async initializeRabbitMQ() {
        try {
            const connection = await connect(
                "amqp://root:root12345@localhost:5672"
            );
            this.channel = await connection.createChannel();
            this.logger.log(
                `Conexão com RabbitMQ estabelecida. Exchange: ${this.exchange}`
            );
        } catch (error) {
            this.logger.error("Erro ao inicializar RabbitMQ:", error);
        }
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async process() {
        try {
            const pendingOutboxes = await this.stockOutboxRepository.getByStatus(["pending"]);

            if (pendingOutboxes.length === 0) {
                this.logger.log("Nenhum evento pendente para processar.");
                return;
            }

            for (const outbox of pendingOutboxes) {
                try {
                    const routingKey = this.receivers.get(outbox.eventName);
                    await this.channel.publish(
                        this.exchange,
                        routingKey,
                        Buffer.from(outbox.event)
                    );
                    outbox.status = "published";
                    await this.stockOutboxRepository.updateStatus([outbox]);

                    this.logger.log(
                        `Evento ${outbox.eventId} processado com sucesso.`
                    );
                } catch (error) {
                    this.logger.error(
                        `Erro ao processar evento ${outbox.eventId}:`,
                        error
                    );
                }
            }
        } catch (error) {
            this.logger.error("Erro no processamento do Outbox:", error);
        }
    }
}
