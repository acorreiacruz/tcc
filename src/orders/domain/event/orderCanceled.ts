import Order from "../entity/order";
import DomainEvent from "./domainEvent";
import crypto from "crypto";

export default class OrderCanceled extends DomainEvent {
    static create(order: Order): OrderCanceled {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const timestamp = new Date();
        return new OrderCanceled(
            eventId,
            order.getId(),
            correlationId,
            "OrderCanceled",
            timestamp,
            "OrderService",
            {
                userId: order.getUserId(),
                orderId: order.getId(),
            }
        );
    }
}
