import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { StockModule } from "../../src/stock.module";
import { Connection, Channel, connect } from "amqplib";
import { EventDTO } from "apps/common/domainEvent";
import { PrismaClient } from "../../src/infraestructure/orm/prisma/prisma-client";
import PrismaClientSingleton from "../../src/infraestructure/orm/prisma/prismaClientSingleton";
import { PrismaService } from "apps/stock/src/prisma.service";


describe("Testing StockController", () => {
    let prismaService: PrismaService = new PrismaService();
    let app: INestApplication;
    let rammitMqConnection: Connection;
    let rabbitMqChannel: Channel;
    const stockData1 = {
        stockId: "e2896eab-ad7a-49b2-a41d-ed589fb42d69",
        itemId: "5e9fc309-3c32-41c5-a53b-f2ac66ece244",
        totalQuantity: 500,
        reservedQuantity: 0,
    };
    const stockData2 = {
        stockId: "35dfd096-9a21-4b69-99b8-aa450228b8f2",
        itemId: "65d59350-ab68-41d8-80f2-099130b64ae4",
        totalQuantity: 1000,
        reservedQuantity: 0,
    };

    beforeAll(async () => {
        rammitMqConnection = await connect("amqp://root:root12345@localhost:5672/");
        rabbitMqChannel = await rammitMqConnection.createChannel();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [StockModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        await prismaService.stock.createMany({
            data: [stockData1, stockData2],
        });
    });

    afterAll(async () => {
        await rabbitMqChannel.close();
        await rammitMqConnection.close();
        await app.close();
        await prismaService.stock.deleteMany();
        await prismaService.stockOutbox.deleteMany();
    });

    const publishEvent = async (
        exchange: string,
        routingKey: string,
        message: EventDTO
    ) => {
        await rabbitMqChannel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            { persistent: true, type: routingKey}
        );
    };

    test("Must consume events from order.placed.queue", async () => {
        const orderPlacedMock: EventDTO = {
            eventId: "f3302778-2f9c-43b1-9e67-e5cfab5ab4e2",
            correlationId: "d709faa4-70bd-4d07-8e44-be348fb73f73",
            name: "order_placed",
            timestamp: new Date(),
            source: "orders.place_order",
            payload: {
                orderId: "fab14822-540a-48a0-99b1-bd42d8d54647",
                userId: "05e09744-c66f-4b48-b8ef-16f2d81e3e76",
                orderItems: {
                    "5e9fc309-3c32-41c5-a53b-f2ac66ece244": { quantity: 100 },
                    "65d59350-ab68-41d8-80f2-099130b64ae4": { quantity: 50 },
                },
                paymentMethod: "credit_card",
                total: 100,
            },
        };
        await publishEvent(
            "order.exchange",
            "order.placed.rk",
            orderPlacedMock
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const stocks = await prismaService.stock.findMany({
            where: {
                itemId: {
                    in: [stockData1.itemId, stockData2.itemId]
                }
            },
            orderBy: {stockId: "asc"}
        });

        expect(stocks[0].reservedQuantity).toBe(100);
        expect(stocks[1].reservedQuantity).toBe(50);
    });
});
