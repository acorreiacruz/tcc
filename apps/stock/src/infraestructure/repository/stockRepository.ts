import {DomainEvent} from "../../../../common/domainEvent";
import Stock from "../../domain/entity/stock";

export interface StockRepository {
    update(stocks: Stock[], event: DomainEvent): Promise<void>;
    getByItemIds(itemIds: string[]): Promise<Stock[]>;
}

export class StocksNotFoundedError extends Error {
    constructor(){
        super("There is no Stocks with this id's");
        this.name = "StocksNotFoundedError";
    }
}