import { FulfillmentMethod, OrderStatus, PaymentMethod } from "./order";

export class InvalidPaymentMethodError extends Error {
    constructor() {
        super(
            `Invalid payment method. It only is possible: ${Object.values(
                PaymentMethod
            ).join(", ")}`
        );
        this.name = "InvalidPaymentMethodError";
    }
}

export class InvalidFulfillmentMethodError extends Error {
    constructor() {
        super(
            `Invalid fulfillment method. It only is possible: ${Object.values(
                FulfillmentMethod
            ).join(", ")}`
        );
        this.name = "InvalidFulfillmentMethodError";
    }
}

export class InvalidOrderStatusError extends Error {
    constructor() {
        super(
            `Invalid order status. It only is possible: ${Object.values(
                OrderStatus
            ).join(", ")}`
        );
        this.name = "InvalidOrderStatusError";
    }
}

export class InvalidTotalOrderError extends Error {
    constructor() {
        super("The total value of a order can't be a negative number");
        this.name = "InvalidTotalOrderError";
    }
}

export class OrderStatusTransitionError extends Error {
    constructor(from: string, to: string) {
        super(
            `It is not allowed to change the order status from '${from}' to '${to}'`
        );
        this.name = "OrderStatusTransitionError";
    }
}


export class OrderConfirmTransitionError extends Error{
    constructor() {
        super("It is only possible confirm a order that is 'pending'");
        this.name = "OrderConfirmTransitionError";
    }
}

export class OrderPrepareTransitionError extends Error {
    constructor() {
        super("It is only possible prepare a order that is 'confirmed'");
        this.name = "OrderPrepareTransitionError";
    }
}

export class OrderAlreadyConfirmedError extends Error {
    constructor() {
        super(`This order has already been confirmed`);
        this.name = "OrderAlreadyConfirmedError";
    }
}

export class OrderAlreadyCanceledError extends Error {
    constructor() {
        super(`This order has already been canceled`);
        this.name = "OrderAlreadyCanceledError";
    }
}

export class OrderAlreadyPreparedError extends Error {
    constructor() {
        super(`This order has already been prepared`);
        this.name = "OrderAlreadyPreparedError";
    }
}
