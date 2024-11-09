import PlaceOrder from "../../application/use_case/placeOrder";
import OrderRepository from "../../domain/repository/orderRepository";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import ItemRepository from "../../domain/repository/itemRepository";
import ItemRepositoryDatabase from "../../infraestructure/repository/itemRepositoryDatabase";
import { PrismaClient } from "@prisma/client";
import Item from "../../domain/entity/item";

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

describe("Tesing PlaceOrder use case", () => {
    beforeEach(async () => {
        await connection.item.createMany({
            data: [item1.toJSON(), item2.toJSON(), item3.toJSON()],
        });
    });

    afterEach(async () => {
        await connection.item.deleteMany();
        await connection.order.deleteMany();
    });

    test("Must place a order", async () => {
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
        const placeOrderOutput = await placeOrder.execute(placeOrderCommand);
        const order = await orderRepository.getById(placeOrderOutput.orderId);
        expect(order.getId()).toBe(placeOrderOutput.orderId);
        expect(order.getStatus()).toBe(placeOrderOutput.status);
        expect(order.getTotal()).toBe(139.5);
    });
});
