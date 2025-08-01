import Stock from "../../src/domain/entity/stock";
import { PrismaClient } from "../../src/infraestructure/orm/prisma/prisma-client";
import {StockRepository} from "../../src/infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../src/infraestructure/repository/stockRepositoryDatabase";
import {DomainEvent} from "../../../common/domainEvent";
import PrismaClientSingleton from "../../src/infraestructure/orm/prisma/prismaClientSingleton";
import { PrismaService } from "apps/stock/src/prisma.service";
import * as dotenv from "dotenv";

dotenv.config();
describe("Testing StockRepository", () => {
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const prismaService: PrismaService = new PrismaService();
    const stockRepository: StockRepository = new StockRepositoryDataBase(prismaService);
    const stock1 = Stock.restore(
        "bd4faf47-27ed-4945-b0bf-910fd1dc9603",
        "810028d5-0650-47b4-a30f-d957c812a855",
        100,
        50
    );
    const stock2 = Stock.restore(
        "dc750505-100a-4350-8cf7-172f4f05726b",
        "69565c0b-cf0e-4bd3-a484-a04b6f68f978",
        500,
        10
    );

    class DomainEventMock extends DomainEvent {
        constructor() {
            super(
                "2170aa2b-21e0-41c8-a97d-f13b391ba328",
                "250beb0f-954d-4d4c-aeff-d4e0289d005d",
                "DomainEventMock",
                new Date(),
                "Mock",
                {}
            );
        }
    }
    beforeEach(async () => {
        await dbClient.stock.createMany({
            data: [stock1.toJSON(), stock2.toJSON()],
        });
    });
    afterEach(async () => {
        await dbClient.stock.deleteMany();
        await dbClient.stockOutbox.deleteMany();
    });
    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must get Stocks by item id's", async () => {
        const stocks: Stock[] = await stockRepository.getByItemIds([
            stock1.getItemId(),
            stock2.getItemId(),
        ]);
        const stockIds: string[] = stocks.map((stock) => stock.getId());
        expect(stockIds.includes(stock1.getId())).toBeTruthy();
        expect(stockIds.includes(stock2.getId())).toBeTruthy();
    });

    test("Must upate a Stock", async () => {
        const domainEventMock = new DomainEventMock();
        await stockRepository.update([stock1], domainEventMock);
        const [stockUpdated] = await stockRepository.getByItemIds([
            stock1.getItemId(),
        ]);
        expect(stockUpdated.getReservedQuantity()).toBe(
            stock1.getReservedQuantity()
        );
        expect(stockUpdated.getTotalQuantity()).toBe(stock1.getTotalQuantity());
    });
});
