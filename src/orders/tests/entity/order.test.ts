import Item from "../../domain/entity/Item";
import Order from "../../domain/entity/order";
import crypto from "crypto";

let orderId: string = crypto.randomUUID();
let userId: string = crypto.randomUUID();
let orderDateString = "2024-11-05T16:30:00";
let orderDate: Date = new Date(orderDateString);
let fulfillmentMethod: string = "delivery";
let paymentMethod: string = "credit_card";
let status: string = "pending";
let item1: Item = Item.create("Ventilador", "Ventilador", 40, 40, 80, 2.5, 150);
let item2: Item = Item.create(
    "Liquidificador",
    "Liquidificador",
    20,
    15,
    45,
    1,
    50
);

describe("Unit testing Order", () => {
    test("Must create a Order", () => {
        const order = Order.create(
            userId,
            orderDate,
            fulfillmentMethod,
            paymentMethod
        );
        expect(order.getTotal()).toBe(0);
        expect(order.getStatus()).toBe("pending");
        expect(order.getFulfillmentMethod()).toBe("delivery");
    });

    test("Must add items to the Order", () => {
        const order = Order.create(
            userId,
            orderDate,
            fulfillmentMethod,
            paymentMethod
        );
        expect(order.getTotal()).toBe(0);
        order.addItem(item1, 2);
        order.addItem(item2, 4);
        expect(order.getOrderItems().length).toBe(2);
        expect(order.getTotal()).toBe(500);
    });

    test("Must not create a Order with invalid fulfillment method", () => {
        fulfillmentMethod = "other";
        expect(() =>
            Order.create(userId, orderDate, fulfillmentMethod, paymentMethod)
        ).toThrow(
            "Invalid payment method. It only is possible: delivery, withdrawal"
        );
    });

    test("Must not create a Order with invalid total value", () => {
        expect(() =>
            Order.restore(
                orderId,
                userId,
                orderDateString,
                status,
                fulfillmentMethod,
                paymentMethod,
                -10
            )
        ).toThrow("The total value of a order can't be a negative number");
    });

    test("Must not create a Order with invalid payment method", () => {
        paymentMethod = "different";
        expect(() =>
            Order.create(userId, orderDate, fulfillmentMethod, paymentMethod)
        ).toThrow(
            "Invalid payment method. It only is possible: credit_card, pix, debit_card"
        );
    });

    test("Must not create a Order with invalid status", () => {
        status = "something_different";
        expect(() =>
            Order.restore(
                orderId,
                userId,
                orderDateString,
                status,
                fulfillmentMethod,
                paymentMethod,
                10
            )
        ).toThrow(
            "Invalid status value. It only is possible: pending, confirmed, in_preparation, ready, out_for_delivery, concluded, canceled, delivery_failed"
        );
    });

});
