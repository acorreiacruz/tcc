import {DomainEvent} from "../../../common/domainEvent";
import { OrderItemsData } from "./entitiesData";

export class OrderPlacedMock extends DomainEvent {
    constructor() {
        super(
            "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
            "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
            "OrderPlaced",
            new Date(),
            "OrderService",
            {
                orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
                userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
                total: 100,
                paymentMethod: "credit_card",
                orderItems: {
                    "83ee283e-94cf-4c78-a4c7-81be95c56e98": { quantity: 10 },
                    "c91ff52a-8898-428c-a6e0-dc7d9698b245": { quantity: 25 },
                },
            }
        );
    }
}

export class StockReservedMock extends DomainEvent {
    constructor() {
        super(
            "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
            "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
            "StockReserved",
            new Date(),
            "StockService",
            {
                orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
                userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
                total: 100,
                paymentMethod: "credit_card",
            }
        );
    }
}

export class OrderConfirmedMock extends DomainEvent {
    constructor(orderItems: OrderItemsData) {
        super(
            "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
            "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
            "OrderConfirmed",
            new Date(),
            "OrderService",
            {
                orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
                userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
                orderItems: orderItems,
            }
        );
    }
}

export class OrderCanceledMock extends DomainEvent {
    constructor(orderStatus: string) {
        super(
            "fcf76b0c-31dd-4c78-985b-63335f28ddf5",
            "8750b03b-a46d-4c14-9c35-2d1d1ad08cc3",
            "order_canceled",
            new Date(),
            "order_cancel_order",
            {
                orderId: "dbbd4d0d-064c-479b-84d7-f011fcb25e22",
                userId: "b6c80e54-aa1c-4272-9796-15ae409472a6",
                orderItems: {
                    "f528ddf5-c04e-420b-bf05-878dbff207bc": { quantity: 50 },
                    "0db4e1e9-1394-475b-961f-42505dde28f0": { quantity: 100 },
                },
                orderStatus: orderStatus,
            }
        );
    }
}
