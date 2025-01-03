import DomainEvent from "../../../../common/domainEvent";
import { Delivery } from "../entity/delivery";
import crypto from "crypto";

export default class DeliveryConcluded extends DomainEvent {
    static create(delivery: Delivery): DeliveryConcluded {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "delivery_concluded";
        const source = "delivery.conclude_delivery";
        const timestamp = new Date();
        const payload = {
            deliveryId: delivery.getId(),
            orderId: delivery.getOrderId(),
        };
        return new DeliveryConcluded(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
