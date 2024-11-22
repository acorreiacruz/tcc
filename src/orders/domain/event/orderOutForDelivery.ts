import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class OrderOutForDelivery extends DomainEvent {
    static create(event: DomainEvent): OrderOutForDelivery {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "order_out_for_delivery";
        const source = "order_delivery_order";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            orderStatus: "out_for_delivery",
        };
        return new OrderOutForDelivery(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
