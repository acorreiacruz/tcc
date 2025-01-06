import Stock from "../../src/domain/entity/stock";
import StockOutboxRepositoryDatabase from "../../src/infraestructure/repository/stockOutboxRepositoryDatabase";
import {StockRepository} from "../../src/infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../src/infraestructure/repository/stockRepositoryDatabase";
import ReserveStock from "../../src/application/use_case/reserveStock";
import OutboxRepository from "../../../common/outboxRepository";
import { PrismaService } from "apps/stock/src/prisma.service";
import { EventDTO } from "apps/common/domainEvent";
import * as dotenv from "dotenv";


dotenv.config();

describe("Testing ReserveStock", () => {
    const prismaService = new PrismaService();
    const stockRepository: StockRepository = new StockRepositoryDataBase(
        prismaService
    );
    const stockOutboxRepository: OutboxRepository =
        new StockOutboxRepositoryDatabase(prismaService);
    const reserveStock: ReserveStock = new ReserveStock(stockRepository);
    const stock1 = Stock.create("83ee283e-94cf-4c78-a4c7-81be95c56e98", 500);
    const stock2 = Stock.create("c91ff52a-8898-428c-a6e0-dc7d9698b245", 1000);
    const orderPlacedMock: EventDTO = {
        eventId: "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
        correlationId: "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
        name: "order_placed",
        timestamp: new Date(),
        source: "orders.place_order",
        payload: {
            orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
            userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
            total: 100,
            paymentMethod: "credit_card",
            orderItems: {
                "83ee283e-94cf-4c78-a4c7-81be95c56e98": { quantity: 10 },
                "c91ff52a-8898-428c-a6e0-dc7d9698b245": { quantity: 25 },
            },
        },
    };
    beforeEach(async () => {
        await prismaService.stock.createMany({
            data: [stock1.toJSON(), stock2.toJSON()],
        });
    });

    afterEach(async () => {
        await prismaService.stock.deleteMany();
        await prismaService.stockOutbox.deleteMany();
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    });
    test("Must reserve Stocks from OrderPlaced domain event received", async () => {
        await reserveStock.execute(orderPlacedMock);
        const [outbox] = await stockOutboxRepository.getByStatus(["pending"]);
        const outboxPayload: EventDTO = JSON.parse(outbox.event);
        console.log(outboxPayload);
        expect(outboxPayload.correlationId).toBe(orderPlacedMock.correlationId);
        expect(outbox.eventName).toBe("stock_reserved");
        expect(outboxPayload.source).toBe("stock_reserve_stock");
        expect(outbox.status).toBe("pending");
    });
});
