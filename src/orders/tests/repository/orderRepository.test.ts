import Item from "../../domain/entity/item";
import Order from "../../domain/entity/order";
import OrderPlaced from "../../domain/event/orderPlaced";
import OrderUpdated from "../../domain/event/orderUpdated";
import OrderRepository from "../../domain/repository/orderRepository";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";
import { PrismaClient } from "@prisma/client";

let orderRepository: OrderRepository = new OrderRepositoryDatabase();
let client: PrismaClient = new PrismaClient();
let order = Order.restore(
    "8d37b5a3-5662-48c0-a84b-b8fade359424",
    "c419212d-0ffc-486e-a022-fbb8d67367f6",
    new Date("2024-11-08T19:30:00"),
    "pending",
    "delivery",
    "credit_card",
    0
);

let item1 = Item.create("Item 1", "Description Item 1", 15.0);
let item2 = Item.create("Item 2", "Description Item 2", 35.0);

describe("Testing OrderRepository", () => {
    beforeEach(async () => {
        await client.order.deleteMany();
        await client.item.createMany({
            data: [
                {
                    itemId: item1.getId(),
                    name: item1.getName(),
                    description: item1.getDescription(),
                    price: item1.getPrice(),
                },
                {
                    itemId: item2.getId(),
                    name: item2.getName(),
                    description: item2.getDescription(),
                    price: item2.getPrice(),
                },
            ],
        });
    });

    afterEach(async () => {
        await client.item.deleteMany();
    });
    
    test("Must create a Order and get it by id", async () => {
        await orderRepository.create(order, OrderPlaced.create(order));
        const orderReceived = await orderRepository.getById(order.getId());
        expect(orderReceived).toBeTruthy();
    });

    test("Must throw a error when there is no Order with specific id", async () => {
        expect(async () => await orderRepository.getById(order.getId())).rejects.toThrow(
            `There is no order with this id: ${order.getId()}`
        );
    });

    test("Must update a Order", async () => {
        expect(order.getTotal()).toBe(0);
        expect(order.getOrderItems().length).toBe(0);
        await orderRepository.create(order, OrderPlaced.create(order));
        order.addItem(item1, 3);
        order.addItem(item2, 4);
        await orderRepository.update(order, OrderUpdated.create(order));
        const orderUpdated = await orderRepository.getById(order.getId());
        expect(orderUpdated.getTotal()).toBe(185);
        expect(order.getOrderItems().length).toBe(2);
    });
});
