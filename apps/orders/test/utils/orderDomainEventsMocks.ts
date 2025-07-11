import DomainEvent from "../../../../services/common/domainEvent";
import { OrderData } from "./entitiesData";

export class OrderDomainEventMock extends DomainEvent {
    constructor() {
        super(
            "5ef7b80e-4808-4dad-a7a1-8e93fd437fe2",
            "913fefd3-39af-4398-b989-a2a0d48d1bc2",
            "OrderEventMocked",
            new Date(),
            "OrderService",
            {
                any: "any",
            }
        );
    }
}

export class PaymentConfirmedMock extends DomainEvent {
    constructor(orderData: OrderData) {
        super(
            "5ef7b80e-4808-4dad-a7a1-8e93fd437fe2",
            "913fefd3-39af-4398-b989-a2a0d48d1bc2",
            "payment_confirmed",
            new Date(),
            "payment_confirm_payment",
            {
                userId: orderData.userId,
                orderId: orderData.orderId,
            }
        );
    }
}

export class DeliveryConcludedMock extends DomainEvent {
    constructor(orderData: OrderData) {
        super(
            "5ef7b80e-4808-4dad-a7a1-8e93fd437fe2",
            "913fefd3-39af-4398-b989-a2a0d48d1bc2",
            "delivery_concluded",
            new Date(),
            "delivery_conlude_delivery",
            {
                orderId: orderData.orderId,
                userId: orderData.userId,
            }
        );
    }
}
