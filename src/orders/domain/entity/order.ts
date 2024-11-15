import Item from "./item";
import OrderItem from "../value_object/orderItem";
import crypto from "crypto";

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
            throw new Error(
                `Invalid payment method. It only is possible: ${Object.values(
                    PaymentMethod
                ).join(", ")}`
            );
        }
        if (
            !Object.values(FulfillmentMethod).includes(
                fulfillmentMethod as FulfillmentMethod
            )
        ) {
            throw new Error(
                `Invalid payment method. It only is possible: ${Object.values(
                    FulfillmentMethod
                ).join(", ")}`
            );
        }
        if (!Object.values(Status).includes(status as Status)) {
            throw new Error(
                `Invalid status value. It only is possible: ${Object.values(
                    Status
                ).join(", ")}`
            );
        }
        if (total < 0)
            throw new Error(
                "The total value of a order can't be a negative number"
            );
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
        if (this.status != "pending")
            throw new Error(
                "It is impossible set Order status as 'confirmed' if is not 'pending'"
            );
        this.status = "confirmed";
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
            "pending",
            fulfillmentMethod,
            paymentMethod,
            0
        );
    }

    fail() {
        this.status = "failed";
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

enum Status {
    Pending = "pending",
    Confirmed = "confirmed",
    InPreparation = "in_preparation",
    Ready = "ready",
    OutForDelivery = "out_for_delivery",
    Concluded = "concluded",
    Canceled = "canceled",
    DeliveryFailed = "delivery_failed",
}

enum FulfillmentMethod {
    Delivery = "delivery",
    Withdrawal = "withdrawal",
}

enum PaymentMethod {
    CreditCard = "credit_card",
    Pix = "pix",
    DebitCard = "debit_card",
}
