import Stock from "../../domain/entity/stock";
import {StockRepository} from "../../infraestructure/repository/stockRepository";
import StockReserved from "../../domain/event/stockReserved";
import {EventDTO} from "../../../../common/domainEvent";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export default class ReserveStock {
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
            stock.reserve(itemQuantity);
        }
        const stockReserved = StockReserved.create(event);
        await this.stockRepository.update(stocks, stockReserved);
    }
}
