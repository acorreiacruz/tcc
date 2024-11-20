import DomainEvent from "../../../common/domainEvent";
import Stock from "../../domain/entity/stock";
import StockRepository from "./stockRepository";
import { PrismaClient } from "../orm/prisma/prisma-client";

export default class StockRepositoryDataBase implements StockRepository {
    private connection: PrismaClient;

    constructor() {
        this.connection = new PrismaClient();
    }

    async update(stocks: Stock[], event: DomainEvent): Promise<void> {
        const stockUpdates = stocks.map((stock) => {
            return this.connection.stock.update({
                where: { stockId: stock.getId() },
                data: {
                    totalQuantity: stock.getTotalQuantity(),
                    reservedQuantity: stock.getReservedQuantity(),
                },
            });
        });
        const stockOutbox = this.connection.stockOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event.toJSON())
            },
        });
        await this.connection.$transaction([...stockUpdates, stockOutbox]);
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
