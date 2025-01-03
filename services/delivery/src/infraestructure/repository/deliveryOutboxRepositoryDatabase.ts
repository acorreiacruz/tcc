import DomainEvent from "../../../../common/domainEvent";
import Outbox from "../../../../common/outbox";
import OutboxRepository from "../../../../common/outboxRepository";
import { PrismaClient } from "../../../prisma/prisma-client";
import PrismaClientSingleton from "../../../prisma/prismaClientSingleton";

export default class DeliveryOutboxRepositoryDatabase implements OutboxRepository {
    private dbClient: PrismaClient;
    constructor() {
        this.dbClient = PrismaClientSingleton.getInstance();
    }

    create(event: DomainEvent): Promise<any> {
        return this.dbClient.deliveryOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event.toJSON()),
            },
        });
    }

    async getByStatus(status: string[]): Promise<Outbox[]> {
        const outboxes = await this.dbClient.deliveryOutbox.findMany({
            where: {
                status: {
                    in: status,
                },
            },
        });
        return outboxes.map((outbox) => {
            return {
                id: outbox.id,
                eventId: outbox.eventId,
                eventName: outbox.eventName,
                status: outbox.status,
                event: outbox.event,
            };
        });
    }

    updateStatus(outboxes: Outbox[]): Promise<any> {
        return this.dbClient.deliveryOutbox.updateMany({
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

    delete(outboxes: Outbox[]): Promise<any> {
        return this.dbClient.deliveryOutbox.deleteMany({
            where: {
                id: {
                    in: outboxes.map((outbox) => outbox.id),
                },
            },
        });
    }
}
