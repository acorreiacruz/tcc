import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { DeliveryPersonRepository } from "../../src/infraestructure/repository/deliveryPersonRepository";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";

describe("Testing DeliveryPersonRepository", () => {
    const deliveryPersonRepository: DeliveryPersonRepository =
        new DeliveryPersonRepositoryDataBase();
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();

    beforeEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
    });

    afterEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must create a delivery person", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            "John Doe",
            "john@example.com",
            "5511999999999",
            "P@ssword123"
        );
        await deliveryPersonRepository.create(deliveryPerson);
        const found = await deliveryPersonRepository.getById(
            deliveryPerson.getId()
        );
        expect(found.getFullName()).toBe(deliveryPerson.getFullName());
        expect(found.getEmail()).toBe(deliveryPerson.getEmail());
        expect(found.getPhoneNumber()).toBe(deliveryPerson.getPhoneNumber());
        expect(found.getStatus()).toBe(deliveryPerson.getStatus());
    });

    test("Must update a delivery person", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            "John Doe",
            "john@example.com",
            "5511999999999",
            "P@ssword123"
        );
        await deliveryPersonRepository.create(deliveryPerson);
        await deliveryPerson.update("John Updated", "updated@example.com");
        await deliveryPersonRepository.update(deliveryPerson);
        const found = await deliveryPersonRepository.getById(
            deliveryPerson.getId()
        );
        expect(found.getFullName()).toBe("John Updated");
        expect(found.getEmail()).toBe("updated@example.com");
    });

    test("Must get delivery persons by status", async () => {
        const person1 = await DeliveryPerson.create(
            "John Doe",
            "john@example.com",
            "5511999999999",
            "P@ssword123"
        );
        const person2 = await DeliveryPerson.create(
            "Jane Doe",
            "jane@example.com",
            "5511988888888",
            "P@ssword123"
        );

        await deliveryPersonRepository.create(person1);
        await deliveryPersonRepository.create(person2);

        person1.startAcceptingDeliveries();
        await deliveryPersonRepository.update(person1);

        const availablePersons = await deliveryPersonRepository.getByStatus(
            "available"
        );
        const offlinePersons = await deliveryPersonRepository.getByStatus(
            "offline"
        );

        expect(availablePersons.length).toBe(1);
        expect(offlinePersons.length).toBe(1);
        expect(availablePersons[0].getFullName()).toBe("John Doe");
        expect(offlinePersons[0].getFullName()).toBe("Jane Doe");
    });
});
