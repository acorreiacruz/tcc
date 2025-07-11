import OrderRepositoryDatabase from "../../src/infraestructure/repository/orderRepositoryDatabase";
import OrderRepository from "../../src/infraestructure/repository/orderRepository";
import ConfirmOrder from "../../src/application/use_case/confirmOrder";
import { PaymentConfirmedMock } from "../utils/orderDomainEventsMocks";
import {
    getItemsData,
    getOrdersData,
    ItemData,
    OrderData,
} from "../utils/entitiesData";
import { PrismaService } from "apps/orders/src/prisma.service";

describe("Testing ConfirmOrder", () => {
    const dbClient: PrismaService = new PrismaService();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase(dbClient);
    const confirmOrder: ConfirmOrder = new ConfirmOrder(orderRepository);
    const itemsData: ItemData[] = getItemsData(3);
    const orderData: OrderData = getOrdersData(1, itemsData, "pending")[0];
    const paymentConfirmedMock: PaymentConfirmedMock = new PaymentConfirmedMock(
        orderData
    );

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

    test("Must confirm a order", async () => {
        await confirmOrder.execute(paymentConfirmedMock);
        const order = await dbClient.order.findFirstOrThrow({
            where: {
                orderId: orderData.orderId,
            },
        });
        expect(order.status).toBe("confirmed");
        const outbox = await dbClient.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.correlationId).toBe(paymentConfirmedMock.correlationId);
        expect(event.payload.orderId).toBe(orderData.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
        expect(event.name).toBe("order_confirmed");
        expect(event.source).toBe("order.confirm_order");
    });
});
