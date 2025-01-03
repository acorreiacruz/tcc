import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { Delivery } from "../../src/domain/entity/delivery";
import {
    DeliveryRepository,
    DeliveryNotFoundError,
} from "../../src/infraestructure/repository/deliveryRepository";
import { DeliveryRepositoryDataBase } from "../../src/infraestructure/repository/deliveryRepositoryDataBase";
import { Location } from "../../src/domain/value_object/location";

describe("Testing DeliveryRepository", () => {
    const deliveryRepository: DeliveryRepository =
        new DeliveryRepositoryDataBase();
    const dbClient = PrismaClientSingleton.getInstance();
    const delivery = Delivery.create(
        "8e829861-4bbe-4416-a907-57215d6c907d",
        new Location(-23.5505, -46.6333)
    );
    const deliveryPersonId = "04f44514-2f9f-4c8e-a97c-4f445c2f2a5d";

    beforeEach(async () => {
        await dbClient.delivery.deleteMany();
        await dbClient.deliveryPerson.create({
            data: {
                id: deliveryPersonId,
                fullName: "John Doe",
                email: "john.doe@example.com",
                phoneNumber: "86912347890",
                passwordHash: "hashed_password",
                status: "offline",
            },
        });
    });

    afterEach(async () => {
        await dbClient.delivery.deleteMany();
        await dbClient.deliveryPerson.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must create a new delivery", async () => {
        await deliveryRepository.create(delivery);
        const savedDelivery = await deliveryRepository.getById(
            delivery.getId()
        );
        expect(savedDelivery).toBeDefined();
        expect(savedDelivery.getId()).toBe(delivery.getId());
        expect(savedDelivery.getOrderId()).toBe(delivery.getOrderId());
        expect(savedDelivery.getStatus()).toBe(delivery.getStatus());
    });

    test("Must throw DeliveryNotFoundError when getting non-existent delivery", async () => {
        const nonExistentId = "c2b0e1f0-ba8d-430f-a6be-8c7a3f1c8e23";
        await expect(deliveryRepository.getById(nonExistentId)).rejects.toThrow(
            DeliveryNotFoundError
        );
    });

    test("Must update a delivery", async () => {
        await deliveryRepository.create(delivery);
        delivery.assign(deliveryPersonId);
        await deliveryRepository.update(delivery);

        const updatedDelivery = await deliveryRepository.getById(
            delivery.getId()
        );
        expect(updatedDelivery.getDeliveryPersonId()).toBe(deliveryPersonId);
        expect(updatedDelivery.getStatus()).toBe("assigned");
    });

    test("Must get delivery with by id", async () => {
        await deliveryRepository.create(delivery);
        const retrievedDelivery = await deliveryRepository.getById(
            delivery.getId()
        );

        expect(retrievedDelivery.getId()).toBe(delivery.getId());
        expect(retrievedDelivery.getOrderId()).toBe(delivery.getOrderId());
        expect(retrievedDelivery.getStatus()).toBe(delivery.getStatus());
        expect(retrievedDelivery.getLocation()).toEqual(delivery.getLocation())
        expect(retrievedDelivery.getAttempts()).toBe(delivery.getAttempts());
    });
});
