import DomainEvent from "../../../common/domainEvent";
import Outbox from "../../../common/outbox";
import OutboxRepository from "../../../common/outboxRepository";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import StockOutboxRepositoryDatabase from "../../infraestructure/repository/stockOutboxRepositoryDatabase";
import { StockReservedMock } from "../utils/stockDomainEventMock";

const connection: PrismaClient = new PrismaClient();
const stockOutboxRepository: OutboxRepository =
    new StockOutboxRepositoryDatabase();
const stockReservedMock: DomainEvent = new StockReservedMock();
let stockOutboxes: Outbox[];

describe("Testing StockOutboxRepository", () => {

    beforeEach(async () => {
        await stockOutboxRepository.create(stockReservedMock);
    });

    afterEach(async () => {
        await connection.stockOutbox.deleteMany();
    });

    test("Must create a outbox from any stock domain event", async () => {
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        expect(stockOutboxes[0].eventId).toBe(stockReservedMock.eventId);
        expect(stockOutboxes[0].eventName).toBe(stockReservedMock.name);
        expect(stockOutboxes[0].payload).toBe(
            JSON.stringify(stockReservedMock)
        );
    });

    test("Must update a outbox record", async () => {
        stockOutboxes = await stockOutboxRepository.getByStatus(["pending"]);
        stockOutboxes[0].status = "published"
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
