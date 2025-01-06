import {EventDTO} from "../../../../common/domainEvent";
import Stock from "../../domain/entity/stock";
import StockConfirmed from "../../domain/event/stockConfirmed";
import {StockRepository} from "../../infraestructure/repository/stockRepository";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export default class ConfirmStock {
    constructor(
        @Inject("StockRepository")
        private readonly stockRepository: StockRepository
    ) {}
    async execute(event: EventDTO): Promise<void> {
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
    }
}
