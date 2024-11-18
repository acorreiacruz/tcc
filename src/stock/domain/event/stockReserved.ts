import DomainEvent from "../../../common/domainEvent";
import crypto from "crypto";
import { ReserveStockCommand } from "../../application/use_case/reserveStock";

export default class StockReserved extends DomainEvent{
    static create(command: ReserveStockCommand): StockReserved {
        const eventId = crypto.randomUUID();
        const name = "StockReserved";
        const source = "StockService";
        const timestamp = new Date();
        const payload = {
            userId: command.userId,
            orderId: command.orderId,
            total: command.total,
            paymentMethod: command.paymentMethod
        }
        return new StockReserved(
            eventId,
            command.correlationId,
            name,
            timestamp,
            source,
            payload
        );
    }
}