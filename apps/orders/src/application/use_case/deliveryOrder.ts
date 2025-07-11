import DomainEvent from "../../../../../services/common/domainEvent";
import OrderOutForDelivery from "../../domain/event/orderOutForDelivery";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

export default class DeliveryOrder {
    constructor(private readonly orderRepository: OrderRepository) {}
    async execute(event: DomainEvent): Promise<void> {
        const order = await this.orderRepository.getById(event.payload.orderId);
        if (order.getStatus() === "out_for_delivery") return;
        if (event.payload.userId !== order.getUserId())
            throw new UnauthorizedOrderUpdateError();
        order.delivery();
        const orderOutForDelivery = OrderOutForDelivery.create(event);
        await this.orderRepository.update(order, orderOutForDelivery);
    }
}
