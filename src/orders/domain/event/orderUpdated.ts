import Order from "../entity/order";
import DomainEvent from "./domainEvent";
import crypto from "crypto";

export default class OrderUpdated extends DomainEvent {
    static create(order: Order): OrderUpdated {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const timestamp = new Date();
        return new OrderUpdated(
            eventId,
            order.getId(),
            correlationId,
            "OrderUpdated",
            timestamp,
            "OrderService",
            {
                userId: order.getUserId(),
                orderId: order.getId(),
            }
        );
    }
}
