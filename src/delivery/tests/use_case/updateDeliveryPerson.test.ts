import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { RegisterDeliveryPerson } from "../../src/application/use_case/registerDeliveryPerson";
import {
    UpdateDeliveryPerson,
    UpdateDeliveryPersonCommand,
} from "../../src/application/use_case/updateDeliveryPerson";
import { InvalidEmailError } from "../../src/domain/value_object/email";
import { InvalidPasswordError } from "../../src/domain/value_object/password";
import { InvalidPhoneNumberError } from "../../src/domain/value_object/phoneNumber";
import {
    DeliveryPersonNotFoundError,
    DeliveryPersonRepository,
} from "../../src/infraestructure/repository/deliveryPersonRepository";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";

describe("Testing UpdateDeliveryPerson", () => {
    const deliveryPersonRepository: DeliveryPersonRepository =
        new DeliveryPersonRepositoryDataBase();
    const dbClient = PrismaClientSingleton.getInstance();
    const updateDeliveryPerson = new UpdateDeliveryPerson(
        deliveryPersonRepository
    );
    let command: any;

    beforeEach(async () => {
        command = {
            deliveryPersonId: "7d83a474-f489-4ca7-ba18-a1fd5bbbdaa1",
            email: "jhondoe@gmail.com",
            fullName: "Jhon Doe Stuart",
            phoneNumber: "5586999999999",
            plainPassword: "P@ssword#123",
        };
        await dbClient.deliveryPerson.create({
            data: {
                id: command.deliveryPersonId,
                fullName: command.fullName,
                email: command.email,
                phoneNumber: command.phoneNumber,
                passwordHash: command.plainPassword,
                status: "offline",
            },
        });
    });

    afterEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    test("Must update a delivery person", async () => {
        await updateDeliveryPerson.excute(command);
        const deliveryPerson = await deliveryPersonRepository.getById(
            command.deliveryPersonId
        );
        expect(deliveryPerson.getEmail()).toBe(command.email);
        expect(deliveryPerson.getFullName()).toBe(command.fullName);
        expect(deliveryPerson.getPhoneNumber()).toBe(command.phoneNumber);
    });

    test("Must not update a delivery person with invalid email", async () => {
        command.email = "invalid-email";
        await expect(updateDeliveryPerson.excute(command)).rejects.toThrow(
            InvalidEmailError
        );
    });

    test("Must not update a delivery person with invalid phone number", async () => {
        command.phoneNumber = "12345";
        await expect(updateDeliveryPerson.excute(command)).rejects.toThrow(
            InvalidPhoneNumberError
        );
    });

    test("Must not update a delivery person with invalid password", async () => {
        command.plainPassword = "weak";
        await expect(updateDeliveryPerson.excute(command)).rejects.toThrow(
            InvalidPasswordError
        );
    });

    test("Must update only provided fields", async () => {
        command.fullName = "New Name";
        await updateDeliveryPerson.excute(command);
        const deliveryPerson = await deliveryPersonRepository.getById(
            command.deliveryPersonId
        );
        expect(deliveryPerson.getFullName()).toBe("New Name");
        expect(deliveryPerson.getEmail()).toBe(command.email);
        expect(deliveryPerson.getPhoneNumber()).toBe(command.phoneNumber);
    });

    test("Must not update a delivery person when it is not found", async () => {
        command.deliveryPersonId = "5b6a9034-4462-4cab-a8d7-838185e6748c";
        await expect(updateDeliveryPerson.excute(command)).rejects.toThrow(
            DeliveryPersonNotFoundError
        );
    });
});
