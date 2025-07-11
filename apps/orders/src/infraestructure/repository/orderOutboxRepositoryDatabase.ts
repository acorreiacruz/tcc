import DomainEvent from "../../../../../services/common/domainEvent";
import OutboxRepository from "../../../../../services/common/outboxRepository";
import Outbox from "../../../../../services/common/outbox";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export default class OrderOutboxRepositoryDatabase implements OutboxRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async delete(outboxes: Outbox[]): Promise<void> {
        await this.prismaService.orderOutbox.deleteMany({
            where: {
                id: { in: outboxes.map((outbox) => outbox.id) },
                status: outboxes[0].status,
            },
        });
    }

    async updateStatus(outboxes: Outbox[]): Promise<void> {
        await this.prismaService.orderOutbox.updateMany({
            where: {
                id: { in: outboxes.map((outbox) => outbox.id) },
            },
            data: {
                status: outboxes[0].status,
            },
        });
    }

    async create(event: DomainEvent): Promise<any> {
        await this.prismaService.orderOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
    }
    async getByStatus(status: string[]): Promise<Outbox[]> {
        const outboxesData = await this.prismaService.orderOutbox.findMany({
            where: {
                status: { in: status },
            },
        });
        return outboxesData.map((outboxData) => ({
            id: outboxData.id,
            eventId: outboxData.eventId,
            eventName: outboxData.eventName,
            status: outboxData.status,
            event: outboxData.event,
        }));
    }
}
