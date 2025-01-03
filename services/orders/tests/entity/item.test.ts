import Item from "../../domain/entity/item";
import crypto from "crypto";

describe("Unit testing Item entity", () => {
    test("Must create a Item", () => {
        const item = new Item(crypto.randomUUID(), "Item", "Description", 5.5);
        expect(item.getPrice()).toBe(5.5);
        expect(item.getDescription()).toBe("Description");
        expect(item.getName()).toBe("Item");
    });

    test("Must not create a Item with invalid price", () => {
        expect(
            () => new Item(crypto.randomUUID(), "Item", "Description", -5.5)
        ).toThrow("The item price must be a strictly positive number");
    });

    test("Must not create a Item with invalid description length", () => {
        expect(
            () =>
                new Item(
                    crypto.randomUUID(),
                    "Item",
                    "Description".repeat(30),
                    5.5
                )
        ).toThrow("Item description has a maximum of 300 characters");
    });

    test("Must not create a Item with invalid name length", () => {
        expect(
            () =>
                new Item(
                    crypto.randomUUID(),
                    "Item".repeat(40),
                    "Description",
                    5.5
                )
        ).toThrow("Item name has a maximum of 150 characters");
    });
});
