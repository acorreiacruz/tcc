import Item from "../../domain/entity/item";
import Order from "../../domain/entity/order";
import crypto from "crypto";

let orderId: string = crypto.randomUUID();
let userId: string = crypto.randomUUID();
let orderDateString = "2024-11-05T16:30:00";
let orderDate: Date = new Date(orderDateString);
let fulfillmentMethod: string = "delivery";
let paymentMethod: string = "credit_card";
let status: string = "pending";
let item1: Item = Item.create("Item1", "Item1 Description", 150);
let item2: Item = Item.create("Item2", "Item2 Description", 50);

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
        expect(() =>
            Order.create(userId, orderDate, "other", paymentMethod)
        ).toThrow(
            "Invalid payment method. It only is possible: delivery, withdrawal"
        );
    });

    test("Must not create a Order with invalid total value", () => {
        expect(() =>
            Order.restore(
                orderId,
                userId,
                orderDate,
                status,
                fulfillmentMethod,
                paymentMethod,
                -10
            )
        ).toThrow("The total value of a order can't be a negative number");
    });

    test("Must not create a Order with invalid payment method", () => {
        expect(() =>
            Order.create(userId, orderDate, fulfillmentMethod, "different")
        ).toThrow(
            "Invalid payment method. It only is possible: credit_card, pix, debit_card"
        );
    });

    test("Must not create a Order with invalid status", () => {
        expect(() =>
            Order.restore(
                orderId,
                userId,
                orderDate,
                "other_status",
                fulfillmentMethod,
                paymentMethod,
                10
            )
        ).toThrow(
            "Invalid status value. It only is possible: pending, confirmed, in_preparation, ready, out_for_delivery, concluded, canceled, delivery_failed"
        );
    });

    test("Must confirm a pending Order", () => {
        const order = Order.create(
            userId,
            orderDate,
            fulfillmentMethod,
            paymentMethod
        );
        expect(order.getStatus()).toBe("pending");
        order.confirm();
        expect(order.getStatus()).toBe("confirmed");
    });

    test("Must not confirm Order that has not a 'pending' status", () => {
        status = "confirmed";
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            status,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(order.getStatus()).toBe("confirmed");
        expect(() => order.confirm()).toThrow(
            "You cannot confirm a Order that is not 'pending'"
        );
    });

    test("Must prepare a confirmed Order", () => {
        status = "confirmed";
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            status,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(order.getStatus()).toBe("confirmed");
        order.prepare();
        expect(order.getStatus()).toBe("in_preparation");
    });

    test("Must not prepare Order that has not a 'confirmed' status", () => {
        status = "pending";
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            status,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(order.getStatus()).toBe("pending");
        expect(() => order.prepare()).toThrow(
            "It is impossible set Order status as 'in_preparation' if is not 'confirmed'"
        );
    });

    test("Must cancel a Order", () => {
        const order = Order.create(
            userId,
            orderDate,
            fulfillmentMethod,
            paymentMethod
        );
        expect(order.getStatus()).toBe("pending");
        order.cancel();
        expect(order.getStatus()).toBe("canceled");
    });

    test("Must fail a Order that is 'out_for_delivery'", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            "out_for_delivery",
            fulfillmentMethod,
            paymentMethod,
            1000
        );
        expect(order.getStatus()).toBe("out_for_delivery");
        order.fail();
        expect(order.getStatus()).toBe("failed");
    });

    test("Must not fail a Order that is not 'out_for_delivery'", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            "confirmed",
            fulfillmentMethod,
            paymentMethod,
            1000
        );
        expect(order.getStatus()).toBe("confirmed");
        expect(() => order.fail()).toThrow(
            "It is impossible set Order status as 'failed' if is not 'out_for_delivery'"
        );
    });

    test("Must conclude a Order that is 'out_for_delivery'", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            "out_for_delivery",
            fulfillmentMethod,
            paymentMethod,
            1000
        );
        expect(order.getStatus()).toBe("out_for_delivery");
        order.conclude();
        expect(order.getStatus()).toBe("concluded");
    });

    test("Must not conclude a Order that is not 'out_for_delivery'", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            "confirmed",
            fulfillmentMethod,
            paymentMethod,
            1000
        );
        expect(order.getStatus()).toBe("confirmed");
        expect(() => order.conclude()).toThrow(
            "It is impossible set Order status as 'concluded' if is not 'out_for_delivery'"
        );
    });

    test("Must delivery a Order that is 'ready'", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            "ready",
            fulfillmentMethod,
            paymentMethod,
            1000
        );
        expect(order.getStatus()).toBe("ready");
        order.delivery();
        expect(order.getStatus()).toBe("out_for_delivery");
    });
});
