import Item from "./Item";
import OrderItem from "./OrderItem";
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
        this.orderDate = orderDate;
        this.userId = userId;
        this.orderId = orderId;
        this.status = status;
        this.orderItems = [];
        this.paymentMethod = paymentMethod;
        if (
            fulfillmentMethod != "delivery" &&
            fulfillmentMethod != "withdrawal"
        ) {
            throw new Error(
                "Invalid fulfillment value. It only is possible 'delivery' or 'withdrawal'"
            );
        }
        this.fulfillmentMethod = fulfillmentMethod;
        if(total <= 0) throw new Error("The total value of a order should be a positive number")
        this.total = total;
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

    getOrderId(): string {
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
    static restore(
        orderId: string,
        userId: string,
        orderDate: string,
        status: string,
        fulfillmentMethod: string,
        paymentMethod: string,
        total: number
    ): Order {
        return new Order(
            orderId,
            userId,
            new Date(orderDate),
            status,
            fulfillmentMethod,
            paymentMethod,
            total
        );
    }
    }
