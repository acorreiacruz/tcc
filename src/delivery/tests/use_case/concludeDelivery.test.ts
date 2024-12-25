import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { Location } from "../../src/domain/value_object/location";
import DeliveryOutboxRepositoryDatabase from "../../src/infraestructure/repository/deliveryOutboxRepositoryDatabase";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";
import { DeliveryRepositoryDataBase } from "../../src/infraestructure/repository/deliveryRepositoryDataBase";
import UnitOfWork from "../../src/infraestructure/unitOfWork";
import { Delivery } from "../../src/domain/entity/delivery";
import { DeliveryAlreadyConcludedError, DeliveryPersonDoesNotMatchError } from "../../src/application/use_case/errors";
import { ConcludeDelivery } from "../../src/application/use_case/concludeDelivery";

describe("Testing ConcludeDelivery", () => {
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const unitOfWork = new UnitOfWork(
        new DeliveryRepositoryDataBase(),
        new DeliveryPersonRepositoryDataBase(),
        new DeliveryOutboxRepositoryDatabase()
    );
    const concludeDelivery = new ConcludeDelivery(unitOfWork);

    const deliveryPerson = DeliveryPerson.restore(
        "48121556-d656-42c2-b451-d018a3593829",
        "Jhon Stuart Doe",
        "jhondoe@email.com",
        "5586922223333",
        "946b306bb528a1ee41f0db6777939235b29375dc4561858edf293fef8316fd49",
        "on_delivery"
    );

    const delivery = Delivery.restore(
        "247916a9-489e-459d-a77d-5fad9157fe4e",
        "119197e9-e349-432a-9009-4244d4046f25",
        "out_for_delivery",
        0,
        new Location(-12.971599, -38.511352),
        deliveryPerson.getId()
    );

    beforeEach(async () => {
        await unitOfWork.execute([
            unitOfWork.deliveryPerson.create(deliveryPerson),
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

    test("Must conclude a delivery", async () => {
        const concludedAt = new Date();
        await concludeDelivery.execute({
            deliveryId: delivery.getId(),
            deliveryPersonId: deliveryPerson.getId(),
            concludedAt,
        });

        const updatedDelivery = await unitOfWork.delivery.getById(
            delivery.getId()
        );
        const updatedDeliveryPerson = await unitOfWork.deliveryPerson.getById(
            deliveryPerson.getId()
        );

        expect(updatedDelivery.getStatus()).toBe("concluded");
        expect(updatedDeliveryPerson.getStatus()).toBe("available");
    });

    test("Must throw error when delivery is already concluded", async () => {
        delivery.conclude(new Date());
        await unitOfWork.delivery.update(delivery);

        await expect(
            concludeDelivery.execute({
                deliveryId: delivery.getId(),
                deliveryPersonId: deliveryPerson.getId(),
                concludedAt: new Date(),
            })
        ).rejects.toThrow(DeliveryAlreadyConcludedError);
    });

    test("Must throw error when delivery person does not match", async () => {
        expect(
            async () =>
                await concludeDelivery.execute({
                    deliveryId: delivery.getId(),
                    deliveryPersonId: "7846fabe-d3af-404d-ace7-a5e754acb91c",
                    concludedAt: new Date(),
                })
        ).rejects.toThrow(DeliveryPersonDoesNotMatchError);
    });
});
