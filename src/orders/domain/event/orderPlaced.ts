import Order from "../entity/order";
import DomainEvent from "./domainEvent";
import crypto from "crypto";

export default class OrderPlaced implements DomainEvent {
    public eventId: string;
    public correlationId: string;
    public entityId: string;
    public name: string;
    public timestamp: Date;
    public source: string;
    public payload: Object;
    private constructor(
        eventId: string,
        correlationId: string,
        entityId: string,
        timestamp: Date,
        payload: Object
    ) {
        this.eventId = eventId;
        this.correlationId = correlationId;
        this.entityId = entityId;
        this.name = "OrderPlaced";
        this.timestamp = timestamp;
        this.source = "OrderService";
        this.payload = payload;
    }

    static create(order: Order): OrderPlaced {
        return new OrderPlaced(
            crypto.randomUUID(),
            crypto.randomUUID(),
            order.getId(),
            new Date(),
            {
                orderId: order.getId(),
                orderItems: order.getOrderItems(),
                paymentMethod: order.getPaymentMethod(),
                total: order.getTotal(),
            }
        );
    }

    toJSON(): Object {
        return {
            eventId: this.eventId,
            correlationId: this.correlationId,
            entityId: this.entityId,
            name: this.name,
            timestamp: this.timestamp,
            source: this.source,
            payload: this.payload,
        };
    }
}
