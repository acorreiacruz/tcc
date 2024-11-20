import Order from "../../domain/entity/order";
import OrderStatusUpdated from "../../domain/event/orderStatusUpdated";
import OrderRepository from "../../infraestructure/repository/orderRepository";

export class CancelOrder {
    private orderRepository: OrderRepository;
    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(command: CancelOrderCommand): Promise<CancelOrderOutput> {
        const order: Order = await this.orderRepository.getById(
            command.orderId
        );
        if (command.userId !== order.getUserId()) {
            throw new UnauthorizedOrderCancellationError();
        }
        order.cancel();
        const orderCanceled = OrderStatusUpdated.create(order, "OrderCanceled");
        await this.orderRepository.update(order, orderCanceled);
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

export class UnauthorizedOrderCancellationError extends Error {
    constructor() {
        super("The logged user cannot cancel another user's order");
        this.name = "UnauthorizedOrderCancellationError";
    }
}
