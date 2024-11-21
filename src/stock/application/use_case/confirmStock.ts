import DomainEvent from "../../../common/domainEvent";
import Stock from "../../domain/entity/stock";
import StockConfirmed from "../../domain/event/stockConfirmed";
import StockRepository from "../../infraestructure/repository/stockRepository";

export default class ConfirmStock {
    constructor(private readonly stockRepository: StockRepository) {}
    async execute(event: DomainEvent): Promise<ConfirmStockOutput> {
        const itemIds: string[] = Object.keys(event.payload.orderItems);
        const stocks: Stock[] = await this.stockRepository.getByItemIds(
            itemIds
        );
        for (const stock of stocks) {
            const itemId = stock.getItemId();
            const itemQuantity = event.payload.orderItems[itemId].quantity;
            stock.confirm(itemQuantity);
        }
        const stockConfirmed = StockConfirmed.create(event);
        await this.stockRepository.update(stocks, stockConfirmed);
        return {
            status: "on_process",
        };
    }
}

type ConfirmStockOutput = {
    status: string;
};