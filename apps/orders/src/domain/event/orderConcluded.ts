import { DomainEvent } from "../../../../common/domainEvent";
import crypto from "crypto";

export default class OrderConcluded extends DomainEvent {
    static create(event: DomainEvent): OrderConcluded {
        const eventId = crypto.randomUUID();
        const correlationId = event.correlationId;
        const name = "order_concluded";
        const source = "order.conclude_order";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            orderStatus: "concluded",
            orderItems: event.payload.orderItems,
        };
        return new OrderConcluded(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
