import crypto from "crypto";

export default class Stock {
    private stockId: string;
    private itemId: string;
    private totalQuantity: number;
    private reservedQuantity: number;
    private constructor(
        stockId: string,
        itemId: string,
        totalQuantity: number,
        reservedQuantity: number
    ) {
        this.stockId = stockId;
        this.itemId = itemId;
        this.totalQuantity = totalQuantity;
        this.reservedQuantity = reservedQuantity;
    }

    getItemId(): string {
        return this.itemId;
    }

    getId(): string {
        return this.stockId;
    }

    getTotalQuantity(): number {
        return this.totalQuantity;
    }

    getReservedQuantity(): number {
        return this.reservedQuantity;
    }

    static create(itemId: string, totalQuantity: number): Stock {
        const stockId = crypto.randomUUID();
        const reservedQuantity = 0;
        return new Stock(stockId, itemId, totalQuantity, reservedQuantity);
    }

}
