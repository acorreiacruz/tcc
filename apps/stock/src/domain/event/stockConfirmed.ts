import {DomainEvent, EventDTO} from "../../../../common/domainEvent";
import crypto from "crypto";

export default class StockConfirmed extends DomainEvent {
    static create(event: EventDTO): StockConfirmed {
        const eventId = crypto.randomUUID();
        const name = "stock_confirmed";
        const source = "stock_confirm_stock";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
        };
        return new StockConfirmed(
            eventId,
            event.correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
