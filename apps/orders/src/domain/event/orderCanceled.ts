import { DomainEvent } from "../../../../common/domainEvent";
import { randomUUID } from "crypto";
import Order from "../entity/order";

export default class OrderCanceled extends DomainEvent {
    static create(order: Order): OrderCanceled {
        const eventId = randomUUID();
        const correlationId = randomUUID();
        const name = "order_canceled";
        const source = "order.cancel_order";
        const timestamp = new Date();
        const payload = {
            userId: order.getUserId(),
            orderId: order.getId(),
            orderStatus: order.getStatus(),
            orderItems: order.getOrderItems(),
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
