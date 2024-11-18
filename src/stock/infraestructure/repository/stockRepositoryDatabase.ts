import Stock from "../../domain/entity/stock";
import StockRepository from "./stockRepository";
import { PrismaClient } from "../orm/prisma/prisma-client";

export default class StockRepositoryDataBase implements StockRepository {
    private connection: PrismaClient;

    constructor() {
        this.connection = new PrismaClient();
    }

    async getByItemIds(itemIds: string[]): Promise<Stock[]> {
        const stockDatas = await this.connection.stock.findMany({
            where: {
                itemId: { in: itemIds },
            }
        });
        return stockDatas.map((stockData) =>
            Stock.restore(
                stockData.stockId,
                stockData.itemId,
                stockData.totalQuantity,
                stockData.reservedQuantity
            )
        );
    }
}
