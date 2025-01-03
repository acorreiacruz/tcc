import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class StockReleased extends DomainEvent {
    static create(event: DomainEvent): StockReleased {
        const eventId = crypto.randomUUID();
        const name = "stock_released";
        const source = "stock_release_stock";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
        };
        return new StockReleased(
            eventId,
            event.correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}
