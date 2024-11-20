import DomainEvent from "../../../common/domainEvent";
import Outbox from "../../../common/outbox";
import OutboxRepository from "../../../common/outboxRepository";
import { PrismaClient } from "../orm/prisma/prisma-client";

export default class StockOutboxRepositoryDatabase implements OutboxRepository {
    private connection: PrismaClient;
    constructor() {
        this.connection = new PrismaClient();
    }

    async create(event: DomainEvent): Promise<void> {
        await this.connection.stockOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                payload: JSON.stringify(event)
            },
        });
    }
}
