import Stock from "./stock";
import {
    NegativeStockError,
    ReservedStockExceedsTotalError,
} from "./stock.errors";

let itemId = "7043c7e6-0da2-4fa7-ab6e-a966428f7cb4";
let stockId = "f20f5264-8a7f-4098-a832-bfa9df6ce8c8";
let stock: Stock;
let totalQuantity: number;
let reservedQuantity: number;
let quantityToBeReserved: number;

describe("Testing Stock", () => {
    beforeEach(() => {
        totalQuantity = 250;
        reservedQuantity = 100;
        quantityToBeReserved = 10;
        stock = Stock.create(itemId, totalQuantity);
    });
    test("Must create a Stock", () => {
        expect(stock.getReservedQuantity()).toBe(0);
        expect(stock.getTotalQuantity()).toBe(250);
        expect(stock.getItemId()).toBe(itemId);
    });

    test("Must not create a Stock with totalQuantity less than zero", () => {
        totalQuantity = -1;
        expect(() => Stock.create(itemId, totalQuantity)).toThrow(
            new NegativeStockError("totalQuantity")
        );
    });

    test("Must not create a Stock with reservedQuantity less than zero", () => {
        reservedQuantity = -150;
        expect(() =>
            Stock.restore(stockId, itemId, totalQuantity, reservedQuantity)
        ).toThrow(new NegativeStockError("reservedQuantity"));
    });

    test("Must not create a Stock with reservedQuantity greater than totalQuantity", () => {
        reservedQuantity = 150;
        totalQuantity = 60;
        expect(() =>
            Stock.restore(stockId, itemId, totalQuantity, reservedQuantity)
        ).toThrow(ReservedStockExceedsTotalError);
    });
    });
