import { PrismaClient } from "@prisma/client";
import DomainEvent from "../../domain/event/domainEvent";
import OutboxRepository from "../../domain/repository/outboxRepository";
import Outbox from "../../application/outbox";

export default class OrderOutboxRepositoryDatabase implements OutboxRepository {
    private connection: PrismaClient;

    constructor() {
        this.connection = new PrismaClient();
    }

    async update(outboxes: Outbox[]): Promise<void> {
        const outboxIds = outboxes.map(outbox => outbox.id);
        await this.connection.orderOutbox.updateMany({
            where: {
                id: { in: outboxIds },
            },
            data: {
                status: outboxes[0].status
            }
        });
    }

    async create(event: DomainEvent): Promise<any> {
        await this.connection.orderOutbox.create({
            data: {
                orderId: event.entityId,
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                payload: JSON.stringify(event),
            },
        });
    }
    async getByStatus(status: string[]): Promise<Outbox[]> {
        const outboxesData = await this.connection.orderOutbox.findMany({
            where: {
                status: { in: status },
            },
        });
        const orderOutboxes = outboxesData.map((outboxData) => ({
            id: outboxData.id,
            eventId: outboxData.eventId,
            eventName: outboxData.eventName,
            entityId: outboxData.orderId,
            status: outboxData.status,
            payload: outboxData.payload,
        }));
        return orderOutboxes;
    }
}
