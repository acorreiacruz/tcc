import { CancelOrder } from "../../application/use_case/cancelOrder";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import {
    getItemsData,
    getOrdersData,
    ItemData,
    OrderData,
} from "../utils/entitiesData";

const itemsData: ItemData[] = getItemsData(3);
const orderData: OrderData = getOrdersData(1, itemsData, "confirmed")[0];
const dbClient: PrismaClient = new PrismaClient();
const orderRepository: OrderRepository = new OrderRepositoryDatabase();
const cancelOrder: CancelOrder = new CancelOrder(orderRepository);
const cancelOrderCommand = {
    orderId: orderData.orderId,
    userId: orderData.userId,
};

describe("Test CancelOrder", () => {
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
});
