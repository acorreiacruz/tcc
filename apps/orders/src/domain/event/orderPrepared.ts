import { DomainEvent } from "../../../../common/domainEvent";
import crypto from "crypto";

export default class OrderPrepared extends DomainEvent {
    static create(event: DomainEvent): OrderPrepared {
        const eventId = crypto.randomUUID();
        const correlationId = event.correlationId;
        const name = "order_prepared";
        const source = "order.prepare_order";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            orderStatus: "ready",
        };
        return new OrderPrepared(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
