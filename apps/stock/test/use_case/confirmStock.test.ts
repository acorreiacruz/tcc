import ConfirmStock from "../../src/application/use_case/confirmStock";
import { PrismaClient } from "../../src/infraestructure/orm/prisma/prisma-client";
import {StockRepository} from "../../src/infraestructure/repository/stockRepository";
import StockRepositoryDataBase from "../../src/infraestructure/repository/stockRepositoryDatabase";
import { PrismaService } from "apps/stock/src/prisma.service";
import { EventDTO } from "apps/common/domainEvent";


describe("Testing ConfirmStock", () => {
    const prismaService: PrismaService = new PrismaService();
    let stockRepository: StockRepository = new StockRepositoryDataBase(
        prismaService
    );
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
    beforeEach(async () => {
        await dbClient.stock.createMany({
            data: [stock1Data, stock2Data],
        });
    });

    afterEach(async () => {
        await dbClient.stockOutbox.deleteMany();
        await dbClient.stock.deleteMany();
    });

    const orderConfirmed: EventDTO = {
        eventId: "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
        correlationId: "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
        name: "OrderConfirmed",
        timestamp: new Date(),
        source: "OrderService",
        payload: {
            orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
            userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
            orderItems: {
                "f528ddf5-c04e-420b-bf05-878dbff207bc": { quantity: 50 },
                "0db4e1e9-1394-475b-961f-42505dde28f0": { quantity: 100 },
            },
        },
    };
    test("Must confirm a reserverd quantity in Stock", async () => {
        await confirmStock.execute(orderConfirmed);
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

        const outbox = await dbClient.stockOutbox.findFirstOrThrow({
            where: {
                status: "pending",
            },
        });
        const event = JSON.parse(outbox.event);
        expect(event.name).toEqual("stock_confirmed");
        expect(event.source).toEqual("stock_confirm_stock");
        expect(event.correlationId).toEqual(orderConfirmed.correlationId);
        expect(event.payload.orderId).toEqual(orderConfirmed.payload.orderId);
        expect(event.payload.userId).toEqual(orderConfirmed.payload.userId);
    });
});
