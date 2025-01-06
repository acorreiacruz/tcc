import { DomainEvent } from "../../../../common/domainEvent";
import Outbox from "../../../../common/outbox";
import OutboxRepository from "../../../../common/outboxRepository";
import { PrismaService } from "../../prisma.service";

export default class StockOutboxRepositoryDatabase implements OutboxRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(event: DomainEvent): Promise<void> {
        await this.prisma.stockOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
    }

    async updateStatus(outboxes: Outbox[]): Promise<void> {
        await this.prisma.stockOutbox.updateMany({
            where: {
                id: {
                    in: outboxes.map((outbox) => outbox.id),
                },
            },
            data: {
                status: outboxes[0].status,
            },
        });
    }

    async getByStatus(status: string[]): Promise<Outbox[]> {
        const outboxDatas = await this.prisma.stockOutbox.findMany({
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
                event: outboxData.event,
            };
        });
    }

    async delete(outboxes: Outbox[]): Promise<void> {
        await this.prisma.stockOutbox.deleteMany({
            where: {
                id: {
                    in: outboxes.map((outbox) => outbox.id),
                },
            },
        });
    }
}
