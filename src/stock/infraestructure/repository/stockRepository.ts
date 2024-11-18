import DomainEvent from "../../../common/domainEvent";
import Stock from "../../domain/entity/stock";

export default interface StockRepository {
    update(stocks: Stock[], event: DomainEvent): Promise<void>;
    getByItemIds(itemIds: string[]): Promise<Stock[]>;
}
