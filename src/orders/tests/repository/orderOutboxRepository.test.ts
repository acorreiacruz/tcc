import { PrismaClient } from "@prisma/client";
import OutboxRepository from "../../domain/repository/outboxRepository";
import OrderOutboxRepositoryDatabase from "../../infraestructure/repository/orderOutboxRepositoryDatabase";
import Order from "../../domain/entity/order";
import OrderPlaced from "../../domain/event/orderPlaced";

let connection: PrismaClient = new PrismaClient();
let orderOutboxRepository: OutboxRepository =
    new OrderOutboxRepositoryDatabase();
let order: Order = Order.restore(
    "7849803c-ae0b-4a9a-89a0-048182681627",
    "b73cfeba-7087-4172-93dc-d77f225c0628",
    new Date("2024-11-09T12:45:00"),
    "pending",
    "delivery",
    "credit_card",
    120
);
let orderPlaced: OrderPlaced = OrderPlaced.create(order);


describe("Testing OrderOutboxRepository", () => {
    beforeEach(async () => {
        await connection.order.create({
            data: {
                orderId: order.getId(),
                userId: order.getUserId(),
                orderDate: order.getOrderDate(),
                status: order.getStatus(),
                paymentMethod: order.getPaymentMethod(),
                fulfillmentMethod: order.getFulfillmentMethod(),
                total: order.getTotal(),
            },
        });
    });

    afterEach(async () => {
        await connection.order.deleteMany();
    });

    test("Must create a OrderOutbox record", async () => {
        await orderOutboxRepository.create(orderPlaced);
        const eventsJSONList = await orderOutboxRepository.getByStatus([
            "pending",
        ]);
        console.log(eventsJSONList);
        expect(eventsJSONList.length).toBe(1);
    });
});
