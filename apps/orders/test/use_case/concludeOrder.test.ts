import OrderRepositoryDatabase from "../../src/infraestructure/repository/orderRepositoryDatabase";
import OrderRepository from "../../src/infraestructure/repository/orderRepository";
import ConcludeOrder from "../../src/application/use_case/concludeOrder";
import { DeliveryConcludedMock } from "../utils/orderDomainEventsMocks";
import { getItemsData, getOrdersData } from "../utils/entitiesData";
import { PrismaService } from "apps/orders/src/prisma.service";

describe("Testing ConcludeOrder", () => {
    const dbClient: PrismaService = new PrismaService();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase(dbClient);
    const concludeOrder: ConcludeOrder = new ConcludeOrder(orderRepository);
    const itemsData = getItemsData(2);
    const orderData = getOrdersData(1, itemsData, "out_for_delivery")[0];
    const deliveryConcludedMock = new DeliveryConcludedMock(orderData);

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

    test("Must conclude a order", async () => {
        await concludeOrder.execute(deliveryConcludedMock);
        const order = await dbClient.order.findFirstOrThrow({
            where: {
                orderId: orderData.orderId,
            },
        });
        expect(order.status).toBe("concluded");
        const outbox = await dbClient.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.correlationId).toBe(deliveryConcludedMock.correlationId);
        expect(event.payload.orderId).toBe(orderData.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
        expect(event.name).toBe("order_concluded");
        expect(event.source).toBe("order.conclude_order");
    });
});
