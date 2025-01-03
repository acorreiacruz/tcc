import DomainEvent from "../../../../common/domainEvent";
import { Delivery } from "../entity/delivery";

export default class DeliveryAssigned extends DomainEvent {
    static create(delivery: Delivery): DeliveryAssigned {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const name = "delivery_assigned";
        const source = "delivery.assign_delivery";
        const timestamp = new Date();
        const payload = {
            deliveryId: delivery.getId(),
            deliveryPersonId: delivery.getDeliveryPersonId(),
        };
        return new DeliveryAssigned(
            eventId,
            correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
