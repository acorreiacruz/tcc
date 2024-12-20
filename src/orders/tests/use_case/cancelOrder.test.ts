import { CancelOrder } from "../../application/use_case/cancelOrder";
import { UnauthorizedOrderUpdateError } from "../../application/use_case/errors";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import PrismaClientSingleton from "../../infraestructure/orm/prismaClientSingleton";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import {
    getItemsData,
    getOrdersData,
    ItemData,
    OrderData,
} from "../utils/entitiesData";

describe("Test CancelOrder", () => {
    const itemsData: ItemData[] = getItemsData(3);
    const orderData: OrderData = getOrdersData(1, itemsData, "confirmed")[0];
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase();
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
        expect(event.source).toBe("order_cancel_order");
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
