import { CancelOrder } from "../../src/application/use_case/cancelOrder";
import { UnauthorizedOrderUpdateError } from "../../src/application/use_case/errors";
import OrderRepository from "../../src/infraestructure/repository/orderRepository";
import OrderRepositoryDatabase from "../../src/infraestructure/repository/orderRepositoryDatabase";
import {
    getItemsData,
    getOrdersData,
    ItemData,
    OrderData,
} from "../utils/entitiesData";
import { PrismaService } from "apps/orders/src/prisma.service";

describe("Test CancelOrder", () => {
    const itemsData: ItemData[] = getItemsData(3);
    const orderData: OrderData = getOrdersData(1, itemsData, "confirmed")[0];
    const dbClient: PrismaService = new PrismaService();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase(
        dbClient
    );
    const cancelOrder: CancelOrder = new CancelOrder(orderRepository);
    const cancelOrderCommand = {
        orderId: orderData.orderId,
        userId: orderData.userId,
    };
    beforeEach(async () => {
        await dbClient.item.createMany({
            data: itemsData,
        });
        await dbClient.order.create({
            data: {
                orderId: orderData.orderId,
                userId: orderData.userId,
                orderDate: orderData.orderDate,
                status: orderData.status,
                paymentMethod: orderData.paymentMethod,
                fulfillmentMethod: orderData.fulfillmentMethod,
                total: orderData.total,
                orderItems: {
                    create: orderData.orderItems,
                },
            },
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

    test("Must cancel a order", async () => {
        await cancelOrder.execute(cancelOrderCommand);
        const order = await dbClient.order.findFirstOrThrow({
            where: {
                orderId: orderData.orderId,
            },
        });
        expect(order.status).toBe("canceled");
        const outbox = await dbClient.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.name).toBe("order_canceled");
        expect(event.source).toBe("order.cancel_order");
        expect(event.payload.orderId).toBe(orderData.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
    });

    test("Must not cancel the same order twice", async () => {
        await cancelOrder.execute(cancelOrderCommand);
        await cancelOrder.execute(cancelOrderCommand);
        const outbox = await dbClient.orderOutbox.findMany({
            where: {
                status: "pending",
            },
        });
        expect(outbox.length).toBe(1);
    });

    test("Must not cancel another user's order", async () => {
        cancelOrderCommand.userId = "another_user_id";
        expect(
            async () => await cancelOrder.execute(cancelOrderCommand)
        ).rejects.toThrow(UnauthorizedOrderUpdateError);
    });
});
