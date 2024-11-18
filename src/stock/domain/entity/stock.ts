import crypto from "crypto";
import {
    ExcessiveStockConfirmationError,
    InsufficientStockForReservationError,
    InvalidStockConfirmationQuantityError,
    InvalidStockReleaseQuantityError,
    InvalidStockReservationQuantityError,
    NegativeStockError,
    ReservedStockExceedsTotalError,
} from "./stock.errors";

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
        if (totalQuantity < 0) throw new NegativeStockError("totalQuantity");
        if (reservedQuantity < 0)
            throw new NegativeStockError("reservedQuantity");
        if (reservedQuantity > totalQuantity)
            throw new ReservedStockExceedsTotalError();
        this.stockId = stockId;
        this.itemId = itemId;
        this.totalQuantity = totalQuantity;
        this.reservedQuantity = reservedQuantity;
    }

    reserve(quantity: number): void {
        if (quantity <= 0) throw new InvalidStockReservationQuantityError();
        if (this.totalQuantity - this.reservedQuantity <= quantity) {
            throw new InsufficientStockForReservationError();
        }
        this.reservedQuantity += quantity;
    }

    release(quantity: number, hadBeenConfirmed: boolean): void {
        if (quantity <= 0) throw new InvalidStockReleaseQuantityError();
        this.reservedQuantity -= quantity;
        if (hadBeenConfirmed) this.totalQuantity += quantity;
    }

    confirm(quantity: number): void {
        if (quantity <= 0) throw new InvalidStockConfirmationQuantityError();
        if (quantity > this.reservedQuantity || quantity > this.totalQuantity)
            throw new ExcessiveStockConfirmationError();
        this.totalQuantity -= quantity;
        this.reservedQuantity -= quantity;
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

    static restore(
        stockId: string,
        itemId: string,
        totalQuantity: number,
        reservedQuantity: number
    ): Stock {
        return new Stock(stockId, itemId, totalQuantity, reservedQuantity);
    }

    toJSON(): any {
        return {
            stockId: this.stockId,
            itemId: this.itemId,
            totalQuantity: this.totalQuantity,
            reservedQuantity: this.reservedQuantity
        }
    }
}
