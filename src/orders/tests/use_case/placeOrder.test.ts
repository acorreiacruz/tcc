import PlaceOrder from "../../application/use_case/placeOrder";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import ItemRepositoryDatabase from "../../infraestructure/repository/itemRepositoryDatabase";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import ItemRepository from "../../infraestructure/repository/itemRepository";
import { getItemsData, getOrdersData, getPlaceOrderCommand } from "../utils/entitiesData";

describe("Tesing PlaceOrder use case", () => {
    const orderRepository: OrderRepository = new OrderRepositoryDatabase();
    const itemRepository: ItemRepository = new ItemRepositoryDatabase();
    const placeOrder: PlaceOrder = new PlaceOrder(
        orderRepository,
        itemRepository
    );
    const dbClient: PrismaClient = new PrismaClient();
    const itemsData = getItemsData(3);
    const orderData = getOrdersData(1, itemsData, "pending")[0];
    const placeOrderCommand = getPlaceOrderCommand(orderData);

    beforeEach(async () => {
        await dbClient.item.createMany({
            data: itemsData,
        });
    });

    afterEach(async () => {
        await dbClient.item.deleteMany();
        await dbClient.order.deleteMany();
        await dbClient.orderOutbox.deleteMany();
    });

    test("Must place a order", async () => {
        const placeOrderOutput = await placeOrder.execute(placeOrderCommand);
        expect(placeOrderOutput.status).toBe("on_process");
        const order = await dbClient.order.findFirstOrThrow({
            where: {
                orderId: placeOrderOutput.orderId,
            },
        });
        expect(order.total).toBe(orderData.total);
        const outbox = await dbClient.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.source).toBe("order_place_order");
        expect(event.name).toBe("order_placed");
        expect(event.payload.orderId).toBe(placeOrderOutput.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
    });
});
