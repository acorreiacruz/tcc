import OutboxRepository from "../domain/repository/outboxRepository";
import MessageBroker from "../infraestructure/messageBroker";
import Outbox from "./outbox";

export default class OrderOutboxService {
    private messageBroker: MessageBroker;
    private destinationQueues: Map<
        string,
        { exchange: string; routingKey: string }
    >;
    private outboxRepository: OutboxRepository;
    constructor(
        messageBroker: MessageBroker,
        outboxRepository: OutboxRepository
    ) {
        this.messageBroker = messageBroker;
        this.outboxRepository = outboxRepository;
        this.destinationQueues = new Map([
            [
                "OrderPlaced",
                { exchange: "order-service", routingKey: "order-placed-rk" },
            ],
            [
                "OrderCanceled",
                { exchange: "order-service", routingKey: "order-canceled-rk" },
            ],
            [
                "OrderUpdated",
                { exchange: "order-service", routingKey: "order-updated-rk" },
            ],
        ]);
    }
    async execute(): Promise<void> {
        const orderOutboxes: Outbox[] = await this.outboxRepository.getByStatus(
            ["pending"]
        );
        const publishedOutboxes: Outbox[] = [];
        const failedOutboxes: Outbox[] = [];
        for (const orderOutbox of orderOutboxes) {
            const destinationInformation = this.destinationQueues.get(
                orderOutbox.eventName
            );
            if (!destinationInformation)
                throw new Error(
                    `There is no destination information associated with the event: ${orderOutbox.eventName}`
                );
            const publishResult = await this.messageBroker.publish(
                orderOutbox.payload,
                destinationInformation.exchange,
                destinationInformation.routingKey
            );
            if (publishResult === "success") {
                orderOutbox.status = "success";
                publishedOutboxes.push(orderOutbox);
            }
            if (publishResult === "failed") {
                orderOutbox.status = "fail";
                failedOutboxes.push(orderOutbox);
            }
        }
        await this.outboxRepository.update([
            ...publishedOutboxes,
            ...failedOutboxes,
        ]);
    }
}
