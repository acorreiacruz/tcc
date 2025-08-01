import DomainEvent from "../../../../../services/common/domainEvent";
import OrderConcluded from "../../domain/event/orderConcluded";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

export default class ConcludeOrder {
    constructor(private readonly orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (order.getStatus() === "concluded") return;
        if (event.payload.userId !== order.getUserId())
            throw new UnauthorizedOrderUpdateError();
        order.conclude();
        const orderConcluded = OrderConcluded.create(event);
        await this.orderRepository.update(order, orderConcluded);
    }
}
