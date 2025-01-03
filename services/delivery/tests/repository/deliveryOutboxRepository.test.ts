import DomainEvent from "../../../common/domainEvent";
import OutboxRepository from "../../../common/outboxRepository";
import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import DeliveryOutboxRepositoryDatabase from "../../src/infraestructure/repository/deliveryOutboxRepositoryDatabase";
import crypto from "crypto";

describe("Testing DeliveryOutboxRepository", () => {
    const repository: OutboxRepository = new DeliveryOutboxRepositoryDatabase();
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    class MockEvent extends DomainEvent {
        constructor() {
            super(
                crypto.randomUUID(),
                crypto.randomUUID(),
                "MockEvent",
                new Date(),
                "delivery",
                "payload"
            );
        }
    }

    afterEach(async () => {
        await dbClient.deliveryOutbox.deleteMany({});
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must create a new outbox record", async () => {
        const event = new MockEvent();
        await repository.create(event);

        const outbox = await dbClient.deliveryOutbox.findFirstOrThrow({
            where: { eventId: event.eventId },
        });
        expect(outbox.eventId).toBe(event.eventId);
        expect(outbox.eventName).toBe(event.name);
        expect(outbox.status).toBe("pending");
        expect(outbox.event).toBe(JSON.stringify(event));
    });

    test("Must search records by status", async () => {
        const event1 = new MockEvent();
        const event2 = new MockEvent();
        const event3 = new MockEvent();
        await repository.create(event1);
        await repository.create(event2);
        await repository.create(event3);
        const results = await repository.getByStatus(["pending"]);
        expect(results).toHaveLength(3);
        expect(results[0].status).toBe("pending");
        expect(results[1].status).toBe("pending");
        expect(results[2].status).toBe("pending");
    });

    test("Must update the status of the records to processed", async () => {
        const event = new MockEvent();
        await repository.create(event);

        const records = await repository.getByStatus(["pending"]);
        const recordToUpdate = records[0];
        recordToUpdate.status = "processed";

        await repository.updateStatus([recordToUpdate]);

        const updated = await dbClient.deliveryOutbox.findFirstOrThrow({
            where: { eventId: event.eventId },
        });

        expect(updated.status).toBe("processed");
    });

    test("Must delete the records specified", async () => {
        const event = new MockEvent();
        await repository.create(event);

        const records = await repository.getByStatus(["pending"]);
        const recordToDelete = records[0];

        await repository.delete([recordToDelete]);

        const deleted = await dbClient.deliveryOutbox.findFirst({
            where: { eventId: event.eventId },
        });

        expect(deleted).toBeNull();
    });
});
