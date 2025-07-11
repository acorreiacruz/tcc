import { DomainEvent } from "../../../../common/domainEvent";
import crypto from "crypto";

export default class OrderFailed extends DomainEvent {
    static create(event: DomainEvent): OrderFailed {
        const eventId = crypto.randomUUID();
        const correlationId = event.correlationId;
        const name = "order_failed";
        const source = "order.fail_order";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            orderStatus: "failed",
        };
        return new OrderFailed(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
