import Item from "./item";
import OrderItem from "../value_object/orderItem";
import crypto from "crypto";
import {
    InvalidFulfillmentMethodError,
    InvalidOrderStatusError,
    InvalidPaymentMethodError,
    InvalidTotalOrderError,
    OrderAlreadyCanceledError,
    OrderAlreadyConfirmedError,
    OrderAlreadyPreparedError,
    OrderConfirmTransitionError,
    OrderPrepareTransitionError,
} from "./order.errors";

export default class Order {
    private orderId: string;
    private userId: string;
    private orderDate: Date;
    private status: string;
    private orderItems: OrderItem[];
    private fulfillmentMethod: string;
    private paymentMethod: string;
    private total: number;

    private constructor(
        orderId: string,
        userId: string,
        orderDate: Date,
        status: string,
        fulfillmentMethod: string,
        paymentMethod: string,
        total: number
    ) {
        if (
            !Object.values(PaymentMethod).includes(
                paymentMethod as PaymentMethod
            )
        ) {
            throw new InvalidPaymentMethodError();
        }
        if (
            !Object.values(FulfillmentMethod).includes(
                fulfillmentMethod as FulfillmentMethod
            )
        ) {
            throw new InvalidFulfillmentMethodError();
        }
        if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
            throw new InvalidOrderStatusError();
        }
        if (total < 0) throw new InvalidTotalOrderError();
        this.orderDate = orderDate;
        this.userId = userId;
        this.orderId = orderId;
        this.status = status;
        this.orderItems = [];
        this.paymentMethod = paymentMethod;
        this.fulfillmentMethod = fulfillmentMethod;
        this.total = total;
    }

    getOrderDate(): Date {
        return this.orderDate;
    }

    getTotal(): number {
        return this.total;
    }

    getFulfillmentMethod(): string {
        return this.fulfillmentMethod;
    }

    getStatus(): string {
        return this.status;
    }

    getId(): string {
        return this.orderId;
    }

    getUserId(): string {
        return this.userId;
    }

    getOrderItems(): OrderItem[] {
        return this.orderItems;
    }

    getPaymentMethod(): string {
        return this.paymentMethod;
    }

    addItem(item: Item, quantity: number): void {
        this.orderItems.push(
            new OrderItem(item.getId(), quantity, item.getPrice())
        );
        this.total += item.getPrice() * quantity;
    }

    confirm(): void {
        if (this.status === OrderStatus.Confirmed)
            throw new OrderAlreadyConfirmedError();
        if (this.status != "pending") throw new OrderConfirmTransitionError();
        this.status = OrderStatus.Confirmed;
    }

    prepare(): void {
        if (this.status === OrderStatus.Ready)
            throw new OrderAlreadyPreparedError();
        if (this.status != OrderStatus.Confirmed)
            throw new OrderPrepareTransitionError();
        this.status = "ready";
    }

    delivery() {
        if (this.status != "ready")
            throw new Error(
                "It is impossible set Order status as 'out_for_delivery' if is not 'ready'"
            );
        this.status = "out_for_delivery";
    }

    conclude() {
        if (this.status != "out_for_delivery")
            throw new Error(
                "It is impossible set Order status as 'concluded' if is not 'out_for_delivery'"
            );
        this.status = "concluded";
    }

    fail() {
        if (this.status != "out_for_delivery")
            throw new Error(
                "It is impossible set Order status as 'failed' if is not 'out_for_delivery'"
            );
        this.status = "failed";
    }

    cancel(): void {
        if (this.status === OrderStatus.Canceled)
            throw new OrderAlreadyCanceledError();
        this.status = "canceled";
    }

    static create(
        userId: string,
        orderDate: Date,
        fulfillmentMethod: string,
        paymentMethod: string
    ): Order {
        return new Order(
            crypto.randomUUID(),
            userId,
            orderDate,
            OrderStatus.Pending,
            fulfillmentMethod,
            paymentMethod,
            0
        );
    }

    static restore(
        orderId: string,
        userId: string,
        orderDate: Date,
        status: string,
        fulfillmentMethod: string,
        paymentMethod: string,
        total: number
    ): Order {
        return new Order(
            orderId,
            userId,
            orderDate,
            status,
            fulfillmentMethod,
            paymentMethod,
            total
        );
    }

    toJSON(): any {
        return {
            orderId: this.orderId,
            userId: this.userId,
            orderItems: this.orderItems,
            orderDate: this.orderDate,
            status: this.status,
            fulfillmentMethod: this.fulfillmentMethod,
            paymentMethod: this.paymentMethod,
            total: this.total,
        };
    }
}

export enum OrderStatus {
    Pending = "pending",
    Confirmed = "confirmed",
    Ready = "ready",
    OutForDelivery = "out_for_delivery",
    Concluded = "concluded",
    Failed = "failed",
    Canceled = "canceled",
}

export enum FulfillmentMethod {
    Delivery = "delivery",
    Withdrawal = "withdrawal",
}

export enum PaymentMethod {
    CreditCard = "credit_card",
    Pix = "pix",
    DebitCard = "debit_card",
}
