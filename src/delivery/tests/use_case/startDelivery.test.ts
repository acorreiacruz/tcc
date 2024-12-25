import { PrismaClient } from "../../prisma/prisma-client";
import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import {
    DeliveryAlreadyStartedError,
    StartDelivery,
    StartDeliveryCommand,
} from "../../src/application/use_case/startDelivery";
import { DeliveryPersonDoesNotMatchError } from "../../src/application/use_case/startDelivery";
import { Delivery } from "../../src/domain/entity/delivery";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { Location } from "../../src/domain/value_object/location";
import { DeliveryOutboxRepositoryDatabase } from "../../src/infraestructure/repository/deliveryOutboxRepositoryDatabase";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";
import { DeliveryRepositoryDataBase } from "../../src/infraestructure/repository/deliveryRepositoryDataBase";
import UnitOfWork from "../../src/infraestructure/unitOfWork";

describe("Testing StartDelivery", () => {
    const dbClient: PrismaClient = PrismaClientSingleton.getInstance();
    const unitOfWork = new UnitOfWork(
        new DeliveryRepositoryDataBase(),
        new DeliveryPersonRepositoryDataBase(),
        new DeliveryOutboxRepositoryDatabase()
    );
    let command: StartDeliveryCommand;
    const startDelivery = new StartDelivery(unitOfWork);
    const deliveryPerson: DeliveryPerson = DeliveryPerson.restore(
        "48121556-d656-42c2-b451-d018a3593829",
        "Jhon Stuart Doe",
        "jhondoe@email.com",
        "5586922223333",
        "946b306bb528a1ee41f0db6777939235b29375dc4561858edf293fef8316fd49",
        "available"
    );
    const deliveryNotStarted: Delivery = Delivery.restore(
        "247916a9-489e-459d-a77d-5fad9157fe4e",
        "119197e9-e349-432a-9009-4244d4046f25",
        "assigned",
        0,
        new Location(-12.971599, -38.511352),
        deliveryPerson.getId()
    );

    beforeEach(async () => {
        command = {
            deliveryPersonId: deliveryPerson.getId(),
            deliveryId: deliveryNotStarted.getId(),
            startedAt: new Date(),
        };
        await unitOfWork.execute([
            unitOfWork.deliveryPerson.create(deliveryPerson),
            unitOfWork.delivery.create(deliveryNotStarted),
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

    test("Must start a delivery", async () => {
        await startDelivery.execute(command);
        const delivery = await unitOfWork.delivery.getById(
            deliveryNotStarted.getId()
        );
        const deliveryPersonSearched = await unitOfWork.deliveryPerson.getById(
            deliveryPerson.getId()
        );
        expect(delivery.getDeliveryPersonId()).toBe(deliveryPerson.getId());
        expect(delivery.getStatus()).toBe("out_for_delivery");
        expect(deliveryPersonSearched.getStatus()).toBe("on_delivery");
    });

    test("Must throw error when delivery person does not match", async () => {
        command.deliveryPersonId = "7846fabe-d3af-404d-ace7-a5e754acb91c";
        expect(
            async () => await startDelivery.execute(command)
        ).rejects.toThrow(DeliveryPersonDoesNotMatchError);
    });

    test("Must throw error when delivery is already started", async () => {
        deliveryNotStarted.start(new Date());
        await unitOfWork.delivery.update(deliveryNotStarted);
        expect(
            async () => await startDelivery.execute(command)
        ).rejects.toThrow(DeliveryAlreadyStartedError);
    });
});
