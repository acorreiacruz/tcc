import crypto from "crypto";

const getRandomInt = (max: number, min: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getStocksData = (
    numberOfStocks: number = 3
): { [itemId: string]: StockData } => {
    const stocksData: { [itemId: string]: StockData } = {};
    for (let i = 1; i <= numberOfStocks; i++) {
        const itemId = crypto.randomUUID();
        stocksData[itemId] = {
            stockId: crypto.randomUUID(),
            itemId: itemId,
            totalQuantity: getRandomInt(500, 1000),
            reservedQuantity: getRandomInt(50, 100),
        };
    }
    return stocksData;
};

export const getOrderItemsData = (stocksData: {
    [itemId: string]: StockData;
}): OrderItemsData => {
    const orderItems: OrderItemsData = {};
    for (const stockData of Object.values(stocksData)) {
        orderItems[stockData.itemId] = { quantity: getRandomInt(1, 40) };
    }
    return orderItems;
};

export type OrderItemsData = { [itemId: string]: { quantity: number } };

export type StockData = {
    stockId: string;
    itemId: string;
    totalQuantity: number;
    reservedQuantity: number;
};
