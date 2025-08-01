import { DomainEvent, EventDTO } from "../../../../common/domainEvent";
import {randomUUID} from "crypto";

export default class StockReserved extends DomainEvent {
    static create(event: EventDTO): StockReserved {
        const eventId = randomUUID();
        const name = "stock_reserved";
        const source = "stock_reserve_stock";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            total: event.payload.total,
            paymentMethod: event.payload.paymentMethod,
        };
        return new StockReserved(
            eventId,
            event.correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
