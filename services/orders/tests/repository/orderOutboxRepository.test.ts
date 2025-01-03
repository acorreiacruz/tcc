import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import OutboxRepository from "../../../common/outboxRepository";
import OrderOutboxRepositoryDatabase from "../../infraestructure/repository/orderOutboxRepositoryDatabase";
import Outbox from "../../../common/outbox";
import { OrderDomainEventMock } from "../utils/orderDomainEventsMocks";
import PrismaClientSingleton from "../../infraestructure/orm/prismaClientSingleton";

describe("Testing OrderOutboxRepository", () => {
    let dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    let orderOutboxRepository: OutboxRepository =
        new OrderOutboxRepositoryDatabase();
    const orderDomainEventMock: OrderDomainEventMock =
        new OrderDomainEventMock();
    let orderOutboxes: Outbox[];
    beforeEach(async () => {
        await orderOutboxRepository.create(orderDomainEventMock);
    });

    afterEach(async () => {
        await dbClient.orderOutbox.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must create a OrderOutbox record from any order domain event", async () => {
        orderOutboxes = await orderOutboxRepository.getByStatus(["pending"]);
        expect(orderOutboxes[0].eventId).toBe(orderDomainEventMock.eventId);
        expect(orderOutboxes[0].eventName).toBe(orderDomainEventMock.name);
        expect(orderOutboxes[0].event).toBe(
            JSON.stringify(orderDomainEventMock)
        );
    });

    test("Must update a OrderOutbox record", async () => {
        orderOutboxes = await orderOutboxRepository.getByStatus(["pending"]);
        orderOutboxes[0].status = "published";
        await orderOutboxRepository.updateStatus(orderOutboxes);
        orderOutboxes = await orderOutboxRepository.getByStatus(["published"]);
        expect(orderOutboxes[0].status).toBe("published");
    });

    test("Must delete a  OrderOutbox record", async () => {
        orderOutboxes = await orderOutboxRepository.getByStatus(["pending"]);
        await orderOutboxRepository.delete(orderOutboxes);
        orderOutboxes = await orderOutboxRepository.getByStatus(["pending"]);
        expect(orderOutboxes.length).toBe(0);
    });
});
