import Order from "../entity/order";
import crypto from "crypto";
import DomainEvent from "../../../common/domainEvent";

export default class OrderPlaced extends DomainEvent {
    static create(order: Order): OrderPlaced {
        const eventId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const timestamp = new Date();
        return new OrderPlaced(
            eventId,
            correlationId,
            "order_placed",
            timestamp,
            "order_place_order",
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
