import Item from "../../domain/entity/item";
import Order from "../../domain/entity/order";
import OrderPlaced from "../../domain/event/orderPlaced";
import ItemRepository from "../../infraestructure/repository/itemRepository";
import OrderRepository from "../../infraestructure/repository/orderRepository";

export default class PlaceOrder {
    private orderRepository: OrderRepository;
    private itemRepository: ItemRepository;

    constructor(
        orderRepository: OrderRepository,
        itemRepository: ItemRepository
    ) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
    }

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
            status: "on_process"
        }
    }
}

type PlaceOrderCommand = {
    userId: string;
    orderDate: string;
    fulfillmentMethod: string;
    paymentMethod: string;
    orderItems: { [itemId: string]: { quantity: number } };
};

type PlaceOrderOutput = {
    orderId: string,
    status: string
}
