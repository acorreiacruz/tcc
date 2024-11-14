import Order from "../../domain/entity/order";
import OrderCanceled from "../../domain/event/orderCanceled";
import OrderRepository from "../../domain/repository/orderRepository";

export default class CancelOrder {
    private orderRepository: OrderRepository;
    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(command: CancelOrderCommand): Promise<CancelOrderOutput> {
        const order: Order = await this.orderRepository.getById(
            command.orderId
        );
        if (command.userId !== order.getUserId())
            throw new Error(
                "The logged user cannot cancel another user's order"
            );
        order.cancel();
        const orderCanceled = OrderCanceled.create(order);
        this.orderRepository.update(order, orderCanceled);
        return { status: "on_process" };
    }
}

type CancelOrderCommand = {
    orderId: string;
    userId: string;
};

type CancelOrderOutput = {
    status: string;
};
