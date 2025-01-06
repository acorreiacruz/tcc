import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { StockModule } from "./stock.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
    try {
        const app = await NestFactory.create(StockModule);
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.RMQ,
            options: {
                urls: ["amqp://root:root12345@localhost:5672"],
                queue: "order.placed.queue",
                queueOptions: { durable: true },
                noAck: false,
                prefetchCount: 1,
                consumerTag: "orderPlacedConsumer",
            },
        });

        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.RMQ,
            options: {
                urls: ["amqp://root:root12345@localhost:5672"],
                queue: "order.canceled.queue",
                queueOptions: { durable: true },
                noAck: false,
                prefetchCount: 1,
                consumerTag: "orderCanceledConsumer",
                
            },
        });

        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.RMQ,
            options: {
                urls: ["amqp://root:root12345@localhost:5672"],
                queue: "order.confirmed.queue",
                queueOptions: { durable: true },
                noAck: false,
                prefetchCount: 2,
                consumerTag: "orderConfirmedConsumer",
            },
        });

        await app.startAllMicroservices();
        console.log("Stock service is running");
        app.listen(5500);
    } catch (error) {
        console.error("Failed to start the stock service:", error);
    }
}
bootstrap();
