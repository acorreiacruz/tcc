import PlaceOrder from "../../application/use_case/placeOrder";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import ItemRepositoryDatabase from "../../infraestructure/repository/itemRepositoryDatabase";
import Item from "../../domain/entity/item";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import ItemRepository from "../../infraestructure/repository/itemRepository";

let orderRepository: OrderRepository = new OrderRepositoryDatabase();
let itemRepository: ItemRepository = new ItemRepositoryDatabase();
let placeOrder: PlaceOrder = new PlaceOrder(orderRepository, itemRepository);
let connection: PrismaClient = new PrismaClient();
let item1 = new Item(
    "78947ecb-bdec-44ec-8574-71911e5fc1c2",
    "Item 1",
    "Description for item 1",
    15.5
);

let item2 = new Item(
    "47d9535b-3297-410a-b766-e200c7cc59c1",
    "Item 2",
    "Description for item 2",
    15.5
);

let item3 = new Item(
    "d1a523a3-1252-4a02-adac-084f3ee57901",
    "Item 3",
    "Description for item 3",
    15.5
);

const placeOrderCommand = {
    userId: "9b27b243-9281-4e64-b32a-cb3976e1b6e3",
    orderDate: "2024-11-09T15:30:00",
    paymentMethod: "credit_card",
    fulfillmentMethod: "delivery",
    orderItems: {
        "78947ecb-bdec-44ec-8574-71911e5fc1c2": { quantity: 2 },
        "47d9535b-3297-410a-b766-e200c7cc59c1": { quantity: 3 },
        "d1a523a3-1252-4a02-adac-084f3ee57901": { quantity: 4 },
    },
};

describe("Tesing PlaceOrder use case", () => {
    beforeAll(async () => {
        await connection.item.createMany({
            data: [item1.toJSON(), item2.toJSON(), item3.toJSON()],
        });
    });

    afterAll(async () => {
        await connection.item.deleteMany();
        await connection.order.deleteMany();
        await connection.orderOutbox.deleteMany();
    });

    test("Must place a order", async () => {
        const placeOrderOutput = await placeOrder.execute(placeOrderCommand);
        expect(placeOrderOutput.status).toBe("on_process");
        const orderPlaced = await orderRepository.getById(placeOrderOutput.orderId);
        expect(orderPlaced.getId()).toBe(placeOrderOutput.orderId);
        expect(orderPlaced.getTotal()).toBe(139.5);
        const outbox = await connection.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
                eventName: "OrderPlaced"
            }
        })
        const event = JSON.parse(outbox.event);
        expect(event.payload.orderId).toBe(orderPlaced.getId());
        expect(event.payload.userId).toBe(orderPlaced.getUserId());
    });
});
