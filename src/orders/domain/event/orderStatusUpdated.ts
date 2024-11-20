import Order from "../entity/order";
import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class OrderStatusUpdated extends DomainEvent {
    static create(order: Order, eventName: string): OrderStatusUpdated {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const timestamp = new Date();
        return new OrderStatusUpdated(
            eventId,
            correlationId,
            eventName,
            timestamp,
            "OrderService",
            {
                userId: order.getUserId(),
                orderId: order.getId(),
                orderStatus: order.getStatus(),
            }
        );
    }
}
