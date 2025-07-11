import PlaceOrder from "../../src/application/use_case/placeOrder";
import OrderRepositoryDatabase from "../../src/infraestructure/repository/orderRepositoryDatabase";
import ItemRepositoryDatabase from "../../src/infraestructure/repository/itemRepositoryDatabase";
import OrderRepository from "../../src/infraestructure/repository/orderRepository";
import {ItemRepository} from "../../src/infraestructure/repository/itemRepository";
import {
    getItemsData,
    getOrdersData,
    getPlaceOrderCommand,
} from "../utils/entitiesData";
import { PrismaService } from "apps/orders/src/prisma.service";

describe("Tesing PlaceOrder use case", () => {
     const dbClient: PrismaService = new PrismaService();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase(dbClient);
    const itemRepository: ItemRepository = new ItemRepositoryDatabase(dbClient);
    const placeOrder: PlaceOrder = new PlaceOrder(
        orderRepository,
        itemRepository
    );
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

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must place a order", async () => {
        const placeOrderOutput = await placeOrder.execute(placeOrderCommand);
        expect(placeOrderOutput.status).toBe("pending");
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
        expect(event.source).toBe("order.place_order");
        expect(event.name).toBe("order_placed");
        expect(event.payload.orderId).toBe(placeOrderOutput.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
    });
});
