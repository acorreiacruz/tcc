import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import ConfirmOrder from "../../application/use_case/confirmOrder";
import { PaymentConfirmedMock } from "../utils/orderDomainEventsMocks";

let orderRepository: OrderRepository = new OrderRepositoryDatabase();
let confirmOrder: ConfirmOrder = new ConfirmOrder(orderRepository);
let dbClient: PrismaClient = new PrismaClient();

const item1 = {
    itemId: "78947ecb-bdec-44ec-8574-71911e5fc1c2",
    name: "Item 1",
    description: "Description for item 1",
    price: 25,
};

const item2 = {
    itemId: "47d9535b-3297-410a-b766-e200c7cc59c1",
    name: "Item 2",
    description: "Description for item 2",
    price: 35,
};

const item3 = {
    itemId: "d1a523a3-1252-4a02-adac-084f3ee57901",
    name: "Item 3",
    description: "Description for item 3",
    price: 55,
};

const orderData = {
    orderId: "cbcfb0e5-0648-49ea-a84e-88ab22e79d26",
    userId: "9b27b243-9281-4e64-b32a-cb3976e1b6e3",
    orderDate: new Date(),
    paymentMethod: "credit_card",
    fulfillmentMethod: "delivery",
    orderItems: [
        {
            itemId: "78947ecb-bdec-44ec-8574-71911e5fc1c2",
            quantity: 2,
            price: 25,
        },
        {
            itemId: "47d9535b-3297-410a-b766-e200c7cc59c1",
            quantity: 3,
            price: 35,
        },
        {
            itemId: "d1a523a3-1252-4a02-adac-084f3ee57901",
            quantity: 4,
            price: 55,
        },
    ],
    total: 375,
};

const paymentConfirmedMock = new PaymentConfirmedMock();

describe("Testing ConfirmOrder", () => {
    beforeEach(async () => {
        await dbClient.item.createMany({
            data: [item1, item2, item3],
        });
        await dbClient.order.create({
            data: {
                orderId: orderData.orderId,
                userId: orderData.userId,
                orderDate: orderData.orderDate,
                status: "pending",
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
        expect(event.payload.orderId).toBe(orderData.orderId);
        expect(event.payload.userId).toBe(orderData.userId);
        expect(event.name).toBe("order_confirmed");
        expect(event.source).toBe("order_confirm_order");
    });
});
