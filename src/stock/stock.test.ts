import Stock from "./stock";
import {
    ExcessiveStockConfirmationError,
    InsufficientStockForReservationError,
    InvalidStockConfirmationQuantityError,
    InvalidStockReleaseQuantityError,
    InvalidStockReservationQuantityError,
    NegativeStockError,
    ReservedStockExceedsTotalError,
} from "./stock.errors";

let itemId = "7043c7e6-0da2-4fa7-ab6e-a966428f7cb4";
let stockId = "f20f5264-8a7f-4098-a832-bfa9df6ce8c8";
let stock: Stock;
let totalQuantity: number;
let reservedQuantity: number;
let quantityToBeReserved: number;
let quantityToConfirm: number;

describe("Testing Stock", () => {
    beforeEach(() => {
        totalQuantity = 250;
        reservedQuantity = 100;
        quantityToBeReserved = 10;
        quantityToConfirm = 20;
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

    test("Must reserve a number of items in Stock", () => {
        quantityToBeReserved = 10;
        expect(stock.getReservedQuantity()).toBe(0);
        expect(stock.getTotalQuantity()).toBe(totalQuantity);
        stock.reserve(quantityToBeReserved);
        expect(stock.getReservedQuantity()).toBe(quantityToBeReserved);
        expect(stock.getTotalQuantity()).toBe(totalQuantity);
    });

    test("Must not reserve a negative number of items in Stock", () => {
        quantityToBeReserved = -10;
        expect(() => stock.reserve(quantityToBeReserved)).toThrow(
            InvalidStockReservationQuantityError
        );
    });

    test("Must not reserve items in Stock when the theoretical quantity available is insufficient", () => {
        quantityToBeReserved = 160;
        stock = Stock.restore(stockId, itemId, totalQuantity, reservedQuantity);
        expect(() => stock.reserve(quantityToBeReserved)).toThrow(
            InsufficientStockForReservationError
        );
    });

    test("Must confirm a reserved quantity of items in Stock", () => {
        stock = Stock.restore(stockId, itemId, totalQuantity, reservedQuantity);
        stock.confirm(quantityToConfirm);
        expect(stock.getReservedQuantity()).toBe(
            reservedQuantity - quantityToConfirm
        );
        expect(stock.getTotalQuantity()).toBe(
            totalQuantity - quantityToConfirm
        );
    });

    test.each([
        [-1, InvalidStockConfirmationQuantityError],
        [0, InvalidStockConfirmationQuantityError],
    ])(
        "Must not confirm a negative or zero quantity of items in Stock",
        (quantity, result) => {
            stock = Stock.restore(
                stockId,
                itemId,
                totalQuantity,
                reservedQuantity
            );
            expect(() => stock.confirm(quantity)).toThrow(result);
            expect(() => stock.confirm(quantity)).toThrow(result);
        }
    );

    test.each([
        [110, ExcessiveStockConfirmationError],
        [260, ExcessiveStockConfirmationError],
    ])(
        "Must not confirm a quantity that is greater than the total quantity or greater than the quantity reserved in Stock",
        (quantity, result) => {
            stock = Stock.restore(
                stockId,
                itemId,
                totalQuantity,
                reservedQuantity
            );
            expect(() => stock.confirm(quantity)).toThrow(result);
        }
    );

    test.each([
        [50, false, 250, 50],
        [50, true, 300, 50],
    ])(
        "Must release a quantity in Stock",
        (quantity, hadBeenConfirmed, total, reserved) => {
            stock = Stock.restore(
                stockId,
                itemId,
                totalQuantity,
                reservedQuantity
            );
            stock.release(quantity, hadBeenConfirmed);
            expect(stock.getTotalQuantity()).toBe(total);
            expect(stock.getReservedQuantity()).toBe(reserved);
        }
    );

    test.each([
        [-1, false, InvalidStockReleaseQuantityError],
        [0, false, InvalidStockReleaseQuantityError],
    ])(
        "Must not release a quantity in Stock that is less than or equal to zero",
        (quantity, hadBeenConfirmed, error) => {
            stock = Stock.restore(
                stockId,
                itemId,
                totalQuantity,
                reservedQuantity
            );
            expect(() => stock.release(quantity, hadBeenConfirmed)).toThrow(
                error
            );
        }
    );
});
