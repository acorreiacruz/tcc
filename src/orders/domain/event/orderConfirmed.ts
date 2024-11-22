import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class OrderConfirmed extends DomainEvent {
    static create(event: DomainEvent): OrderConfirmed {
        const eventId = crypto.randomUUID();
        const correlationId = event.correlationId;
        const name = "order_confirmed";
        const source = "order_confirm_order";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            orderStatus: "confirmed",
        };
        return new OrderConfirmed(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
