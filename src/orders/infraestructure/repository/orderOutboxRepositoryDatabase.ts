import { PrismaClient } from "@prisma/client";
import DomainEvent from "../../domain/event/domainEvent";
import OutboxRepository from "../../domain/repository/outboxRepository";

export default class OrderOutboxRepositoryDatabase implements OutboxRepository {
    private connection: PrismaClient;

    constructor(){
        this.connection = new PrismaClient();
    }

    async create(event: DomainEvent): Promise<any> {
        await this.connection.orderOutbox.create({
            data:{
                orderId: event.entityId,
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                payload: JSON.stringify(event),

            }
        });
    }
    async getByStatus(status: string[]): Promise<string[]> {
        const orderOutboxDatas = await this.connection.orderOutbox.findMany({
            where: {
                status: {in: status}
            }
        })
        const eventsList = orderOutboxDatas.map(orderOutboxData => JSON.stringify(orderOutboxData.payload));
        return eventsList;
    }

}