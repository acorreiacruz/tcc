import { Test, TestingModule } from "@nestjs/testing";
import { StockController } from "../../src/stock.controller";
import { RmqContext } from "@nestjs/microservices";
import ConfirmStock from "../../src/application/use_case/confirmStock";
import ReserveStock from "../../src/application/use_case/reserveStock";
import ReleaseStock from "../../src/application/use_case/releaseStock";
import {EventDTO} from "apps/common/domainEvent";

describe("Testing StockController with mocks", () => {
    let stockController: StockController;
    let confirmStock: ConfirmStock;
    let reserveStock: ReserveStock;
    let releaseStock: ReleaseStock; 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StockController],
            providers: [
                {
                    provide: ConfirmStock,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: ReserveStock,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: ReleaseStock,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        stockController = module.get<StockController>(StockController);
        confirmStock = module.get<ConfirmStock>(ConfirmStock);
        reserveStock = module.get<ReserveStock>(ReserveStock);
        releaseStock = module.get<ReleaseStock>(ReleaseStock);
    });

    test("Must be defined", () => {
        expect(stockController).toBeDefined();
    });


    test("Must call ReserveStock with the correct payload", async () => {
        const event: EventDTO = {
            eventId: "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
            correlationId: "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
            name: "order_placed",
            timestamp: new Date(),
            source: "orders.place_order",
            payload: {
                orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
                userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
                total: 100,
                paymentMethod: "credit_card",
                orderItems: {
                    "83ee283e-94cf-4c78-a4c7-81be95c56e98": { quantity: 10 },
                    "c91ff52a-8898-428c-a6e0-dc7d9698b245": { quantity: 25 },
                },
            },
        };
        const mockContext: RmqContext = {
            getChannelRef: jest.fn().mockReturnValue({
                ack: jest.fn(),
            }),
            getMessage: jest.fn().mockReturnValue({}),
        } as any;

        await stockController.handleOrderPlaced(event, mockContext);

        expect(reserveStock.execute).toHaveBeenCalledWith(event);
        expect(mockContext.getChannelRef().ack).toHaveBeenCalled();
    });

    test("Must call ConfirmStock with the correct payload", async () => {
        const event: EventDTO = {
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
        const mockContext: RmqContext = {
            getChannelRef: jest.fn().mockReturnValue({
                ack: jest.fn(),
            }),
            getMessage: jest.fn().mockReturnValue({}),
        } as any;

        await stockController.handleOrderConfirmed(event, mockContext);

        expect(confirmStock.execute).toHaveBeenCalledWith(event);
        expect(mockContext.getChannelRef().ack).toHaveBeenCalled();
    });


    test("Must call ReleaseStock with the correct payload", async () => {
    const event: EventDTO = {
        eventId: "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
        correlationId: "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
        name: "order_canceled",
        timestamp: new Date(),
        source: "order_cancel_order",
        payload: {
            orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
            userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
            orderItems: {
                "f528ddf5-c04e-420b-bf05-878dbff207bc": { quantity: 50 },
                "0db4e1e9-1394-475b-961f-42505dde28f0": { quantity: 100 },
            },
            orderStatus: "confirmed",
        },
    };
        const mockContext: RmqContext = {
            getChannelRef: jest.fn().mockReturnValue({
                ack: jest.fn(),
            }),
            getMessage: jest.fn().mockReturnValue({}),
        } as any;

        await stockController.handleOrderCanceled(event, mockContext);

        expect(releaseStock.execute).toHaveBeenCalledWith(event);
        expect(mockContext.getChannelRef().ack).toHaveBeenCalled();
    })
});
