import DomainEvent from "../../../common/domainEvent";
import OrderFailed from "../../domain/event/orderFailed";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

export default class FailOrder {
    constructor(private readonly orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (order.getStatus() === "failed") return;
        if (event.payload.userId !== order.getUserId())
            throw new UnauthorizedOrderUpdateError();
        order.fail();
        const orderFailed = OrderFailed.create(event);
        await this.orderRepository.update(order, orderFailed);
    }
}
