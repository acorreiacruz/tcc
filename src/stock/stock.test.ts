import Stock from "./stock";

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
    });
