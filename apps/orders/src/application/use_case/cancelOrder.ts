import { Inject, Injectable } from "@nestjs/common";
import Order from "../../domain/entity/order";
import OrderCanceled from "../../domain/event/orderCanceled";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import { UnauthorizedOrderUpdateError } from "./errors";

@Injectable()
export class CancelOrder {
    constructor(@Inject("OrderRepository") private readonly orderRepository: OrderRepository) {}

    async execute(command: CancelOrderCommand): Promise<CancelOrderOutput> {
        const order: Order = await this.orderRepository.getById(
            command.orderId
        );
        if (order.getStatus() === "canceled")
            return { status: "already_canceled" };
        if (command.userId !== order.getUserId()) {
            throw new UnauthorizedOrderUpdateError();
        }
        order.cancel();
        const orderCanceled = OrderCanceled.create(order);
        await this.orderRepository.update(order, orderCanceled);
        return { status: "on_process" };
    }
}

export type CancelOrderCommand = {
    orderId: string;
    userId: string;
};

export type CancelOrderOutput = {
    status: string;
};
