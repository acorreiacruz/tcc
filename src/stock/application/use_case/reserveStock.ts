import Stock from "../../domain/entity/stock";
import StockRepository from "../../infraestructure/repository/stockRepository";
import StockReserved from "../../domain/event/stockReserved";
import DomainEvent from "../../../common/domainEvent";

export class ReserveStock {
    constructor(private stockRepository: StockRepository) {}
    async execute(event: DomainEvent): Promise<ReserveStockOutput> {
        const itemIds: string[] = Object.keys(event.payload.orderItems);
        const stocks: Stock[] = await this.stockRepository.getByItemIds(
            itemIds
        );
        for (const stock of stocks) {
            const itemId = stock.getItemId();
            const itemQuantity = event.payload.orderItems[itemId].quantity;
            stock.reserve(itemQuantity);
        }
        const stockReserved = StockReserved.create(event);
        await this.stockRepository.update(stocks, stockReserved);
        return {
            status: "on_process",
        };
    }
}

type ReserveStockOutput = {
    status: "on_process";
};
