import DomainEvent from "../../../../../services/common/domainEvent";
import OrderPrepared from "../../domain/event/orderPrepared";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

export default class PrepareOrder {
    constructor(private orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (order.getStatus() === "ready") return;
        if (event.payload.userId !== order.getUserId())
            throw new UnauthorizedOrderUpdateError();
        order.prepare();
        const orderPrepared = OrderPrepared.create(event);
        await this.orderRepository.update(order, orderPrepared);
    }
}
