import DomainEvent from "../../../../common/domainEvent";
import { Delivery } from "../entity/delivery";
import crypto from "crypto";

export default class DeliveryStarted extends DomainEvent {
    static create(delivery: Delivery): DeliveryStarted {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "delivery_started";
        const source = "delivery.start_delivery";
        const timestamp = new Date();
        const payload = {
            deliveryId: delivery.getId(),
            orderId: delivery.getOrderId(),
        };
        return new DeliveryStarted(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
