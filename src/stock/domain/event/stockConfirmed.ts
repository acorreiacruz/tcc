import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class StockConfirmed extends DomainEvent {
    static create(event: DomainEvent): StockConfirmed {
        const eventId = crypto.randomUUID();
        const name = "StockConfirmed";
        const source = "StockService";
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
