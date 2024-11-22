import DomainEvent from "../../../common/domainEvent";
import OrderStatusUpdated from "../../domain/event/orderStatusUpdated";
import OrderRepository from "../../infraestructure/repository/orderRepository";

export default class ConfirmOrder {
    constructor(private orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (event.payload.userId !== order.getUserId())
            throw new Error(
                "The logged user cannot confirm another user's order"
            );
        order.confirm();
        const orderConfirmed = OrderStatusUpdated.create(
            order,
            "order_confirmed",
            "order_confirm_order"
        );
        await this.orderRepository.update(order, orderConfirmed);
    }
}
