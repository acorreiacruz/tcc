import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";
import Order from "../entity/order";

export default class OrderCanceled extends DomainEvent {
    static create(order: Order): OrderCanceled {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "order_canceled";
        const source = "order_cancel_order";
        const timestamp = new Date();
        const payload = {
            userId: order.getUserId(),
            orderId: order.getId(),
            orderStatus: order.getStatus(),
        };
        return new OrderCanceled(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
