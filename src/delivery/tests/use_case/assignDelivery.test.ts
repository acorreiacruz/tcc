import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { Location } from "../../src/domain/value_object/location";
import DeliveryOutboxRepositoryDatabase from "../../src/infraestructure/repository/deliveryOutboxRepositoryDatabase";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";
import { DeliveryRepositoryDataBase } from "../../src/infraestructure/repository/deliveryRepositoryDataBase";
import UnitOfWork from "../../src/infraestructure/unitOfWork";
import { Delivery } from "../../src/domain/entity/delivery";
import { AssignDelivery } from "../../src/application/use_case/assignDelivery";
import { DeliveryAlreadyAssignedError } from "../../src/application/use_case/errors";
import { NotAvailableDeliveryPersonsError } from "../../src/infraestructure/repository/deliveryPersonRepository";

describe("Testing AssignDelivery", () => {
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const unitOfWork = new UnitOfWork(
        new DeliveryRepositoryDataBase(),
        new DeliveryPersonRepositoryDataBase(),
        new DeliveryOutboxRepositoryDatabase()
    );
    const assignDelivery = new AssignDelivery(unitOfWork);

    const deliveryPerson1 = DeliveryPerson.restore(
        "48121556-d656-42c2-b451-d018a3593829",
        "Jhon Stuart Doe",
        "jhondoe@email.com",
        "5586922223333",
        "946b306bb528a1ee41f0db6777939235b29375dc4561858edf293fef8316fd49",
        "available",
        new Location(-8.047562, -34.877003)
    );

    const deliveryPerson2 = DeliveryPerson.restore(
        "58121556-d656-42c2-b451-d018a3593830",
        "Jane Doe",
        "janedoe@email.com",
        "5586922224444",
        "946b306bb528a1ee41f0db6777939235b29375dc4561858edf293fef8316fd50",
        "available",
        new Location(35.689487, 139.691711)
    );

    const delivery = Delivery.restore(
        "247916a9-489e-459d-a77d-5fad9157fe4e",
        "119197e9-e349-432a-9009-4244d4046f25",
        "on_hold",
        0,
        new Location(-12.971599, -38.511352)
    );

    beforeEach(async () => {
        await unitOfWork.execute([
            unitOfWork.deliveryPerson.create(deliveryPerson1),
            unitOfWork.deliveryPerson.create(deliveryPerson2),
            unitOfWork.delivery.create(delivery),
        ]);
    });

    afterEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
        await dbClient.delivery.deleteMany();
        await dbClient.deliveryLocation.deleteMany();
        await dbClient.deliveryOutbox.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must assign delivery to the nearest available delivery person", async () => {
        await assignDelivery.execute({
            deliveryId: delivery.getId(),
        });

        const updatedDelivery = await unitOfWork.delivery.getById(
            delivery.getId()
        );
        expect(updatedDelivery.getStatus()).toBe("assigned");
        expect(updatedDelivery.getDeliveryPersonId()).toBe(
            deliveryPerson1.getId()
        );
    });

    test("Must throw error when delivery is already assigned", async () => {
        delivery.assign(deliveryPerson1.getId());
        await unitOfWork.delivery.update(delivery);
        expect(async () => {
            await assignDelivery.execute({
                deliveryId: delivery.getId(),
            });
        }).rejects.toThrow(DeliveryAlreadyAssignedError);
    });

    test("Must throw error when delivery persons is not available", async () => {
        deliveryPerson1.startDelivery();
        await unitOfWork.deliveryPerson.update(deliveryPerson1);

        expect(async () => {
            await assignDelivery.execute({
                deliveryId: delivery.getId(),
            });
        }).rejects.toThrow(NotAvailableDeliveryPersonsError);
    });


});
