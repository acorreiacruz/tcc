import OutboxRepository from "../domain/repository/outboxRepository";
import MessageBroker from "../infraestructure/messageBroker";
import Outbox from "./outbox";
import {
    ORDER_PLACED_EXCHANGE,
    ORDER_PLACED_ROUTING_KEY,
    ORDER_CANCELED_EXCHANGE,
    ORDER_CANCELED_ROUTING_KEY,
    ORDER_UPDATED_EXCHANGE,
    ORDER_UPDATED_ROUTING_KEY,
} from "../settings/credentials";

export default class OrderOutboxProcessor {
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
                {
                    exchange: ORDER_PLACED_EXCHANGE,
                    routingKey: ORDER_PLACED_ROUTING_KEY,
                },
            ],
            [
                "OrderCanceled",
                {
                    exchange: ORDER_CANCELED_EXCHANGE,
                    routingKey: ORDER_CANCELED_ROUTING_KEY,
                },
            ],
            [
                "OrderUpdated",
                {
                    exchange: ORDER_UPDATED_EXCHANGE,
                    routingKey: ORDER_UPDATED_ROUTING_KEY,
                },
            ],
        ]);
    }