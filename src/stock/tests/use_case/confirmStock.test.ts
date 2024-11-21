import ConfirmStock from "../../application/use_case/confirmStock";
import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import StockRepository from "../../infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../infraestructure/repository/stockRepositoryDatabase";
import { OrderConfirmedMock } from "../utils/stockDomainEventMock";

let stockRepository: StockRepository = new StockRepositoryDataBase();
let confirmStock: ConfirmStock = new ConfirmStock(stockRepository);
let dbClient: PrismaClient = new PrismaClient();
let stock1Data = {
    stockId: "d7cecf6e-6e1c-40f2-b9b9-1b2622251096",
    itemId: "f528ddf5-c04e-420b-bf05-878dbff207bc",
    totalQuantity: 500,
    reservedQuantity: 100,
};
let stock2Data = {
    stockId: "ded520fc-24df-418c-bee3-268f4a3f4d97",
    itemId: "0db4e1e9-1394-475b-961f-42505dde28f0",
    totalQuantity: 1000,
    reservedQuantity: 200,
};
const orderConfirmedMock = new OrderConfirmedMock();

describe("Testing ConfirmStock", () => {
    beforeEach(async () => {
        await dbClient.stock.createMany({
            data: [stock1Data, stock2Data],
        });
    });

    afterEach(async () => {
        await dbClient.stockOutbox.deleteMany();
        await dbClient.stock.deleteMany();
    });

    test("Must confirm a reserverd quantity in Stock", async () => {
        await confirmStock.execute(orderConfirmedMock);
        const stocksData = await dbClient.stock.findMany({
            where: {
                stockId: { in: [stock1Data.stockId, stock2Data.stockId] },
            },
            orderBy: {
                stockId: "asc",
            },
        });
        const stock1 = stocksData[0];
        const stock2 = stocksData[1];
        expect(stock1.reservedQuantity).toBe(50);
        expect(stock1.totalQuantity).toBe(450);
        expect(stock2.reservedQuantity).toBe(100);
        expect(stock2.totalQuantity).toBe(900);

        console.log(orderConfirmedMock.eventId);
        const outbox = await dbClient.stockOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.name).toEqual("StockConfirmed");
        expect(event.correlationId).toEqual(orderConfirmedMock.correlationId);
        expect(event.payload.orderId).toEqual(
            orderConfirmedMock.payload.orderId
        );
        expect(event.payload.userId).toEqual(
            orderConfirmedMock.payload.userId
        );
    });
});
