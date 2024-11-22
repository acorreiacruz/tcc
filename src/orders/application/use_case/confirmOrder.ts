import DomainEvent from "../../../common/domainEvent";
import OrderConfirmed from "../../domain/event/orderConfirmed";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

export default class ConfirmOrder {
    constructor(private orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (order.getStatus() === "confirmed") return;
        if (event.payload.userId !== order.getUserId())
            throw new UnauthorizedOrderUpdateError();
        order.confirm();
        const orderConfirmed = OrderConfirmed.create(event);
        await this.orderRepository.update(order, orderConfirmed);
    }
}
