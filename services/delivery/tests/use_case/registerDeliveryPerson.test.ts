import PrismaClientSingleton from "../../prisma/prismaClientSingleton";
import { RegisterDeliveryPerson } from "../../src/application/use_case/registerDeliveryPerson";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { InvalidEmailError } from "../../src/domain/value_object/email";
import { InvalidPasswordError } from "../../src/domain/value_object/password";
import { InvalidPhoneNumberError } from "../../src/domain/value_object/phoneNumber";
import { DeliveryPersonRepository } from "../../src/infraestructure/repository/deliveryPersonRepository";
import { DeliveryPersonRepositoryDataBase } from "../../src/infraestructure/repository/deliveryPersonRepositoryDataBase";

describe("Testing RegisterDeliveryPerson", () => {
    const deliveryPersonRepository: DeliveryPersonRepository =
        new DeliveryPersonRepositoryDataBase();
    let deliveryPerson: DeliveryPerson;
    const registerDeliveryPerson = new RegisterDeliveryPerson(
        deliveryPersonRepository
    );
    const dbClient = PrismaClientSingleton.getInstance();

    beforeEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
    });

    afterEach(async () => {
        await dbClient.deliveryPerson.deleteMany();
    });

    afterAll(async () => {
        await dbClient.$disconnect();
    });

    const command = {
        fullName: "Jhon Doe Stuart",
        phoneNumber: "5586911112222",
        plainPassword: "P@ssword#123",
        email: "jhon.doe@stuart.com",
    };

    test("Must register a delivery person", async () => {
        const deliveryPersonOutput = await registerDeliveryPerson.excute(
            command
        );
        deliveryPerson = await deliveryPersonRepository.getById(
            deliveryPersonOutput.id
        );
        expect(deliveryPerson.getFullName()).toBe(command.fullName);
        expect(deliveryPerson.getPhoneNumber()).toBe(command.phoneNumber);
        expect(deliveryPerson.getEmail()).toBe(command.email);
    });

    test("Must not register a delivery person with invalid phone number", async () => {
        command.email = "jhon.doe@email.com"
        command.phoneNumber = "8691111";
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidPhoneNumberError);
    });

    test("Must not register a delivery person with invalid email", async () => {
        command.phoneNumber = "5586911112222";
        command.email = "teste@com";
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidEmailError);
    });

    test("Must not register a delivery person with invalid password", async () => {
        command.plainPassword = "P@sswo";   
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidPasswordError);
    });
});
