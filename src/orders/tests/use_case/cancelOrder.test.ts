import {
    CancelOrder,
    UnauthorizedOrderCancellationError,
} from "../../application/use_case/cancelOrder";
import Order from "../../domain/entity/order";
import OrderPlaced from "../../domain/event/orderPlaced";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OrderRepository from "../../infraestructure/repository/orderRepository";
import OrderRepositoryDatabase from "../../infraestructure/repository/orderRepositoryDatabase";

const cancelOrderCommand = {
    orderId: "8b3a393d-27a0-4b0b-8ad8-b262a1f16730",
    userId: "c8f31107-d8a5-4ef1-93b7-eb15f25fce82",
};

const order: Order = Order.restore(
    "8b3a393d-27a0-4b0b-8ad8-b262a1f16730",
    "c8f31107-d8a5-4ef1-93b7-eb15f25fce82",
    new Date(),
    "confirmed",
    "delivery",
    "credit_card",
    100
);
const client: PrismaClient = new PrismaClient();
const orderRepository: OrderRepository = new OrderRepositoryDatabase();
const cancelOrder: CancelOrder = new CancelOrder(orderRepository);
const orderPlaced: OrderPlaced = OrderPlaced.create(order);

describe("Test CancelOrder", () => {
    beforeAll(async () => {
        await orderRepository.create(order, orderPlaced);
    });

    afterAll(async () => {
        await client.order.deleteMany();
        await client.orderOutbox.deleteMany();
    });

    test("Must cancel a order placed", async () => {
        await cancelOrder.execute(cancelOrderCommand);
        const orderCanceled = await orderRepository.getById(order.getId());
        expect(orderCanceled.getStatus()).toBe("canceled");
        const orderOutbox = await client.orderOutbox.findFirstOrThrow({
            where: {
                status: "pending",
                eventName: "OrderCanceled",
            },
        });
        const event = JSON.parse(orderOutbox.event);
        expect(event.name).toBe("OrderCanceled");
        expect(event.payload.orderId).toBe(order.getId());
    });

    test("Must not cancel a order placed by another logged user", async () => {
        cancelOrderCommand.userId = "another_user_id";
        expect(
            async () => await cancelOrder.execute(cancelOrderCommand)
        ).rejects.toThrow(UnauthorizedOrderCancellationError);
    });
});
