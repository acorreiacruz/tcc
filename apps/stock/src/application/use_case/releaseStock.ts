import {EventDTO} from "../../../../common/domainEvent";
import Stock from "../../domain/entity/stock";
import StockReleased from "../../domain/event/stockReleased";
import {StockRepository} from "../../infraestructure/repository/stockRepository";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export default class ReleaseStock {
    constructor(
        @Inject("StockRepository")
        private readonly stockRepository: StockRepository
    ) {}
    async execute(event: EventDTO): Promise<void> {
        const hadBeenConfirmed =
            event.payload.orderStatus === "pending" ? false : true;
        const itemIds: string[] = Object.keys(event.payload.orderItems);
        const stocks: Stock[] = await this.stockRepository.getByItemIds(
            itemIds
        );
        for (const stock of stocks) {
            const itemId = stock.getItemId();
            const itemQuantity = event.payload.orderItems[itemId].quantity;
            stock.release(itemQuantity, hadBeenConfirmed);
        }
        const stockReleased = StockReleased.create(event);
        await this.stockRepository.update(stocks, stockReleased);
    }
}
