import Outbox from "../../../common/outbox";
import OutboxRepository from "../../../common/outboxRepository";
import { PrismaClient } from "../../src/infraestructure/orm/prisma/prisma-client";
import PrismaClientSingleton from "../../src/infraestructure/orm/prisma/prismaClientSingleton";
import StockOutboxRepositoryDatabase from "../../src/infraestructure/repository/stockOutboxRepositoryDatabase";
import { StockReservedMock } from "../utils/stockDomainEventMock";
import { PrismaService } from "apps/stock/src/prisma.service";
import * as dotenv from "dotenv";

dotenv.config();
describe("Testing StockOutboxRepository", () => {
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const primaService = new PrismaService();
    const stockOutboxRepository: OutboxRepository = new StockOutboxRepositoryDatabase(primaService);
    const stockReservedMock = new StockReservedMock();
    let stockOutboxes: Outbox[];
    beforeEach(async () => {
        await stockOutboxRepository.create(stockReservedMock);
    });

    afterEach(async () => {
        await dbClient.stockOutbox.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must get a outbox by status", async () => {
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        expect(stockOutboxes[0].eventId).toBe(stockReservedMock.eventId);
        expect(stockOutboxes[0].eventName).toBe(stockReservedMock.name);
        expect(stockOutboxes[0].event).toBe(JSON.stringify(stockReservedMock));
    });

    test("Must update a outbox record", async () => {
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        stockOutboxes[0].status = "published";
        await stockOutboxRepository.updateStatus(stockOutboxes);
        stockOutboxes = await stockOutboxRepository.getByStatus(["published"]);
        expect(stockOutboxes[0].status).toBe("published");
    });

    test("Must delete a outbox record", async () => {
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        await stockOutboxRepository.delete(stockOutboxes);
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        expect(stockOutboxes.length).toBe(0);
    });
});
