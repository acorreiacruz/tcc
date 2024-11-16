import OrderStatusUpdated from "../../domain/event/orderStatusUpdated";
import OrderRepository from "../../domain/repository/orderRepository";

export default class PrepareOrder {
    constructor(private orderRepository: OrderRepository) {}
    async execute(command: PrepareOrderCommand): Promise<PrepareOrderOutput> {
        const order = await this.orderRepository.getById(command.orderId);
        if (command.userId !== order.getUserId())
            throw new Error(
                "The logged user cannot prepare another user's order"
            );
        order.prepare();
        const orderPrepared = OrderStatusUpdated.create(order, "OrderPrepared");
        await this.orderRepository.update(order, orderPrepared);
        return {
            status: "on_process",
        };
    }
}

export type PrepareOrderCommand = {
    orderId: string;
    userId: string;
};

export type PrepareOrderOutput = {
    status: string;
};
