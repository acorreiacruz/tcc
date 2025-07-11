import Order from "../entity/order";
import { randomUUID } from "crypto";
import {DomainEvent} from "../../../../common/domainEvent";

export default class OrderPlaced extends DomainEvent {
    static create(order: Order): OrderPlaced {
        const eventId = randomUUID();
        const correlationId = randomUUID();
        const timestamp = new Date();
        return new OrderPlaced(
            eventId,
            correlationId,
            "order_placed",
            timestamp,
            "order.place_order",
            {
                orderId: order.getId(),
                userId: order.getUserId(),
                orderItems: order.getOrderItems(),
                paymentMethod: order.getPaymentMethod(),
                total: order.getTotal(),
            }
        );
    }
}
