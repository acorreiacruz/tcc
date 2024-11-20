import { PrismaClient } from "../../infraestructure/orm/prisma/prisma-client";
import DomainEvent from "../../../common/domainEvent";
import OutboxRepository from "../../../common/outboxRepository";
import Outbox from "../../../common/outbox";

export default class OrderOutboxRepositoryDatabase implements OutboxRepository {
    private connection: PrismaClient;

    constructor() {
        this.connection = new PrismaClient();
    }

    async delete(outboxes: Outbox[]): Promise<void> {
        await this.connection.orderOutbox.deleteMany({
            where: {
                id: { in: outboxes.map((outbox) => outbox.id) },
                status: outboxes[0].status,
            },
        });
    }

    async updateStatus(outboxes: Outbox[]): Promise<void> {
        await this.connection.orderOutbox.updateMany({
            where: {
                id: { in: outboxes.map((outbox) => outbox.id) },
            },
            data: {
                status: outboxes[0].status,
            },
        });
    }

    async create(event: DomainEvent): Promise<any> {
        await this.connection.orderOutbox.create({
            data: {
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
        return outboxesData.map((outboxData) => ({
            id: outboxData.id,
            eventId: outboxData.eventId,
            eventName: outboxData.eventName,
            status: outboxData.status,
            payload: outboxData.payload,
        }));
    }
}
