import OrderItem from "../../domain/entity/orderItem";
import crypto from "crypto";

describe("Unit testing OrderItem value object", () => {
    test("Must create a OrdeItem", () => {
        const itemId = crypto.randomUUID();
        const orderItem = new OrderItem(itemId, 3, 150);
        expect(orderItem.getPrice()).toBe(150);
        expect(orderItem.getQuantity()).toBe(3);
        expect(orderItem.getSubTotal()).toBe(450);
    });

    test("Must not create a OrdeItem with invalid price value", () => {
        const itemId = crypto.randomUUID();
        expect(() => new OrderItem(itemId, 3, -150)).toThrow(
            "Invalid price value. The value must be a positive number"
        );
    });

    test("Must not create a OrdeItem with invalid quantity value", () => {
        const itemId = crypto.randomUUID();
        expect(() => new OrderItem(itemId, -3, 150)).toThrow(
            "Invalid quantity value. The value must be a positivie number"
        );
    });
});
