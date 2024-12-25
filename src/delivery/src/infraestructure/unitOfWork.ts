import OutboxRepository from "../../../common/outboxRepository";
import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { DeliveryPersonRepository } from "./repository/deliveryPersonRepository";
import { DeliveryRepository } from "./repository/deliveryRepository";

export default class UnitOfWork {
    private dbClient: PrismaClient;
    readonly delivery: DeliveryRepository;
    readonly deliveryPerson: DeliveryPersonRepository;
    readonly outbox: OutboxRepository;
    constructor(
        deliveryRepository: DeliveryRepository,
        deliveryPersonRepository: DeliveryPersonRepository,
        outboxRepository: OutboxRepository
    ) {
        this.dbClient = PrismaClientSingleton.getInstance();
        this.delivery = deliveryRepository;
        this.deliveryPerson = deliveryPersonRepository;
        this.outbox = outboxRepository;
    }

    async execute(operations: any[]): Promise<any> {
        return await this.dbClient.$transaction(operations, {isolationLevel: "ReadCommitted"});
    }
}
