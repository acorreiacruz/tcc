import OrderStatusUpdated from "../../domain/event/orderStatusUpdated";
import OrderRepository from "../../infraestructure/repository/orderRepository";

export default class ConfirmOrder {
    constructor(private orderRepository: OrderRepository) {}
    async execute(command: ConfirmOrderCommand): Promise<ConfirmOrderOutput> {
        const order = await this.orderRepository.getById(command.orderId);
        if (command.userId !== order.getUserId())
            throw new Error(
                "The logged user cannot confirm another user's order"
            );
        order.confirm();
        const orderConfirmed = OrderStatusUpdated.create(order, "OrderConfirmed");
        await this.orderRepository.update(order, orderConfirmed);
        return {
            status: "on_process",
        };
    }
}

export type ConfirmOrderCommand = {
    orderId: string;
    userId: string;
};

export type ConfirmOrderOutput = {
    status: string;
};
