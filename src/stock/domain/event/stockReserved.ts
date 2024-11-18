import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";

export default class StockReserved extends DomainEvent{
    static create(event: DomainEvent): StockReserved {
        const eventId = crypto.randomUUID();
        const name = "StockReserved";
        const source = "StockService";
        const timestamp = new Date();
        const payload = {
            userId: event.payload.userId,
            orderId: event.payload.orderId,
            total: event.payload.total,
            paymentMethod: event.payload.paymentMethod
        }
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