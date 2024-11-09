import Order from "../entity/order";
import DomainEvent from "./domainEvent";
import crypto from "crypto";

export default class OrderPlaced implements DomainEvent {
    public eventId: string;
    public entityId: string;
    public correlationId: string;
    public name: string;
    public timestamp: Date;
    public source: string;
    public payload: Object;
    private constructor(
        eventId: string,
        entityId: string,
        correlationId: string,
        timestamp: Date,
        payload: Object
    ) {
        this.eventId = eventId;
        this.correlationId = correlationId;
        this.entityId = entityId;
        this.timestamp = timestamp;
        this.name = "OrderPlaced";
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
}
