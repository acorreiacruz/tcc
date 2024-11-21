import Stock from "../../domain/entity/stock";
import StockReserved from "../../domain/event/stockReserved";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import StockOutboxRepositoryDatabase from "../../infraestructure/repository/stockOutboxRepositoryDatabase";
import StockRepository from "../../infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../infraestructure/repository/stockRepositoryDatabase";
import { ReserveStock } from "../../application/use_case/reserveStock";
import OutboxRepository from "../../../common/outboxRepository";
import { OrderPlacedMock } from "../utils/stockDomainEventMock";

const connection: PrismaClient = new PrismaClient();
const stockRepository: StockRepository = new StockRepositoryDataBase();
const stockOutboxRepository: OutboxRepository =
    new StockOutboxRepositoryDatabase();
const reserveStock: ReserveStock = new ReserveStock(stockRepository);
const stock1 = Stock.create("83ee283e-94cf-4c78-a4c7-81be95c56e98", 500);
const stock2 = Stock.create("c91ff52a-8898-428c-a6e0-dc7d9698b245", 1000);
const orderPlacedMock: OrderPlacedMock = new OrderPlacedMock();

describe("Testing ReserveStock", () => {
    beforeEach(async () => {
        await connection.stock.createMany({
            data: [stock1.toJSON(), stock2.toJSON()],
        });
    });

    afterEach(async () => {
        await connection.stock.deleteMany();
        await connection.stockOutbox.deleteMany();
    });
    test("Must reserve Stocks from OrderPlaced domain event received", async () => {
        const result = await reserveStock.execute(orderPlacedMock);
        expect(result.status).toBe("on_process");
        const [outbox] = await stockOutboxRepository.getByStatus(["pending"]);
        const outboxPayload: StockReserved = JSON.parse(outbox.event);
        expect(outboxPayload.correlationId).toBe(orderPlacedMock.correlationId);
        expect(outbox.eventName).toBe("stock_reserved");
        expect(outboxPayload.source).toBe("stock_reserve_stock");
        expect(outbox.status).toBe("pending");
    });
});
