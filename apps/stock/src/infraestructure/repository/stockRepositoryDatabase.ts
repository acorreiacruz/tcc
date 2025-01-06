import {DomainEvent} from "../../../../common/domainEvent";
import Stock from "../../domain/entity/stock";
import {StockRepository, StocksNotFoundedError} from "./stockRepository";
import { PrismaService } from "../../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class StockRepositoryDataBase implements StockRepository {
    constructor(private readonly prisma: PrismaService) {}

    async update(stocks: Stock[], event: DomainEvent): Promise<void> {
        const stockUpdates = stocks.map((stock) => {
            return this.prisma.stock.update({
                where: { stockId: stock.getId() },
                data: {
                    totalQuantity: stock.getTotalQuantity(),
                    reservedQuantity: stock.getReservedQuantity(),
                },
            });
        });
        const stockOutbox = this.prisma.stockOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event.toJSON())
            },
        });
        await this.prisma.$transaction([...stockUpdates, stockOutbox]);
    }

    async getByItemIds(itemIds: string[]): Promise<Stock[]> {
        const stockDatas = await this.prisma.stock.findMany({
            where: {
                itemId: { in: itemIds },
            }
        });
        if(!stockDatas || stockDatas.length !== itemIds.length) {
            throw new StocksNotFoundedError();
        }
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
