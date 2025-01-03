import Item from "../../domain/entity/item";
import Order, { OrderStatus } from "../../domain/entity/order";
import crypto from "crypto";
import {
    InvalidFulfillmentMethodError,
    InvalidOrderStatusError,
    InvalidPaymentMethodError,
    InvalidTotalOrderError,
    OrderAlreadyCanceledError,
    OrderAlreadyConfirmedError,
    OrderConfirmTransitionError,
    OrderPrepareTransitionError,
} from "../../domain/entity/order.errors";

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
        ).toThrow(InvalidFulfillmentMethodError);
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
        ).toThrow(InvalidTotalOrderError);
    });

    test("Must not create a Order with invalid payment method", () => {
        expect(() =>
            Order.create(userId, orderDate, fulfillmentMethod, "different")
        ).toThrow(InvalidPaymentMethodError);
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
        ).toThrow(InvalidOrderStatusError);
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

    test("Must not confirm an order that has already been confirmed", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            OrderStatus.Confirmed,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(() => order.confirm()).toThrow(OrderAlreadyConfirmedError);
    });

    test("Must not confirm Order that has not a 'pending' status", () => {
        status = OrderStatus.OutForDelivery;
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            status,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(() => order.confirm()).toThrow(OrderConfirmTransitionError);
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
        expect(order.getStatus()).toBe("ready");
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
        expect(() => order.prepare()).toThrow(OrderPrepareTransitionError);
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

    test("Must not cancel a Order that has already been canceled", () => {
        const order = Order.restore(
            orderId,
            userId,
            orderDate,
            OrderStatus.Canceled,
            fulfillmentMethod,
            paymentMethod,
            100
        );
        expect(() => order.cancel()).toThrow(OrderAlreadyCanceledError);
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

    test("Must not delivery a Order that is not 'ready'", () => {
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
        expect(() => order.delivery()).toThrow(
            "It is impossible set Order status as 'out_for_delivery' if is not 'ready'"
        );
    });
});
