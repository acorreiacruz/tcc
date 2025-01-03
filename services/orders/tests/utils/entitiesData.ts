import crypto from "crypto";
import { PlaceOrderCommand } from "../../application/use_case/placeOrder";

const getRandomInt = (max: number, min: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getItemsData = (itemsQuantity: number = 3): ItemData[] => {
    const itemData = [];
    for (let i = 1; i <= itemsQuantity; i++) {
        itemData.push({
            itemId: crypto.randomUUID(),
            name: `Item ${i}`,
            description: `Description of Item ${i}`,
            price: getRandomInt(5, 50),
        });
    }
    return itemData;
};

export const getOrdersData = (
    ordersQuantity: number = 1,
    itemsData: ItemData[],
    status: string = "confirmed",
    paymentMethod: string = "credit_card",
    fulfillmentMethod: string = "delivery"
): OrderData[] => {
    const ordersData: OrderData[] = [];
    const orderItems = itemsData.map((value) => {
        return {
            itemId: value.itemId,
            quantity: getRandomInt(1, 10),
            price: value.price,
        };
    });
    const total = orderItems.reduce((subTotal, orderItem) => {
        return (subTotal += orderItem.price * orderItem.quantity);
    }, 0);
    for (let i = 1; i <= ordersQuantity; i++) {
        ordersData.push({
            orderId: crypto.randomUUID(),
            userId: crypto.randomUUID(),
            status: status,
            orderDate: new Date(),
            paymentMethod: paymentMethod,
            fulfillmentMethod: fulfillmentMethod,
            orderItems: orderItems,
            total: total,
        });
    }
    return ordersData;
};

export const getPlaceOrderCommand = (orderData: OrderData): PlaceOrderCommand => {
    const orderItems: { [itemId: string]: { quantity: number } } = {};
    for (const orderItem of orderData.orderItems) {
        orderItems[orderItem.itemId] = { quantity: orderItem.quantity };
    }
    return {
        userId: orderData.userId,
        orderDate: "2024-11-22T15:45:00",
        paymentMethod: orderData.paymentMethod,
        fulfillmentMethod: orderData.fulfillmentMethod,
        orderItems: orderItems,
    };
};

export type ItemData = {
    itemId: string;
    name: string;
    description: string;
    price: number;
};

export type OrderData = {
    orderId: string;
    userId: string;
    status: string;
    orderDate: Date;
    paymentMethod: string;
    fulfillmentMethod: string;
    orderItems: { itemId: string; quantity: number; price: number }[];
    total: number;
};
