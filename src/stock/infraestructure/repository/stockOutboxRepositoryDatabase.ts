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

    async updateStatus(outboxes: Outbox[]): Promise<void> {
        await this.connection.stockOutbox.updateMany({
            where: {
                id: {
                    in: outboxes.map(outbox => outbox.id)
                }
            },
            data: {
                status: outboxes[0].status
            }
        });
    }

    async getByStatus(status: string[]): Promise<Outbox[]> {
        const outboxDatas = await this.connection.stockOutbox.findMany({
            where: {
                status: {
                    in: status,
                },
            },
        });
        return outboxDatas.map((outboxData) => {
            return {
                id: outboxData.id,
                eventId: outboxData.eventId,
                eventName: outboxData.eventName,
                status: outboxData.status,
                payload: outboxData.payload,
            };
        });
    }

}
