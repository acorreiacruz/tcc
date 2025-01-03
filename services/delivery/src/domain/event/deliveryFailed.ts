import DomainEvent from "../../../../common/domainEvent";
import { Delivery } from "../entity/delivery";
import crypto from "crypto";

export default class DeliveryFailed extends DomainEvent {
    static create(delivery: Delivery): DeliveryFailed {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "delivery_failed";
        const source = "delivery.fail_delivery";
        const timestamp = new Date();
        const payload = {
            deliveryId: delivery.getId(),
            orderId: delivery.getOrderId(),
        };
        return new DeliveryFailed(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
