import Stock from "../../domain/entity/stock";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import StockRepository from "../../infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../infraestructure/repository/stockRepositoryDatabase";
const connection: PrismaClient = new PrismaClient();
const stockRepository: StockRepository = new StockRepositoryDataBase();
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
describe("Testing StockRepository", () => {
    beforeAll(async () => {
        await connection.stock.createMany({
            data: [stock1.toJSON(), stock2.toJSON()],
        });
    });

    afterAll(async () => {
        await connection.stock.deleteMany();
        await connection.stockOutbox.deleteMany();
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
    });
