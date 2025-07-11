import { Inject, Injectable } from "@nestjs/common";
import Item from "../../domain/entity/item";
import Order from "../../domain/entity/order";
import OrderPlaced from "../../domain/event/orderPlaced";
import { ItemRepository } from "../../infraestructure/repository/itemRepository";
import OrderRepository from "../../infraestructure/repository/orderRepository";

@Injectable()
export default class PlaceOrder {
    constructor(
        @Inject("OrderRepository")
        private readonly orderRepository: OrderRepository,
        @Inject("ItemRepository")
        private readonly itemRepository: ItemRepository
    ) {}

    async execute(command: PlaceOrderCommand): Promise<PlaceOrderOutput> {
        const order: Order = Order.create(
            command.userId,
            new Date(command.orderDate),
            command.fulfillmentMethod,
            command.paymentMethod
        );
        const items: Item[] = await this.itemRepository.getByIds(
            Object.keys(command.orderItems)
        );
        for (const item of items) {
            order.addItem(item, command.orderItems[item.getId()].quantity);
        }
        const orderPlaced = OrderPlaced.create(order);
        await this.orderRepository.create(order, orderPlaced);
        return {
            orderId: order.getId(),
            status: order.getStatus(),
        };
    }
}

export type PlaceOrderCommand = {
    userId: string;
    orderDate: string;
    fulfillmentMethod: string;
    paymentMethod: string;
    orderItems: { [itemId: string]: { quantity: number } };
};

export type PlaceOrderOutput = {
    orderId: string;
    status: string;
};
