import { RegisterDeliveryPerson } from "../../src/application/use_case/registerDeliveryPerson";
import { DeliveryPerson } from "../../src/domain/entity/deliveryPerson";
import { InvalidEmailError } from "../../src/domain/value_object/email";
import { InvalidPasswordError } from "../../src/domain/value_object/password";
import { InvalidPhoneNumberError } from "../../src/domain/value_object/phoneNumber";
import { DeliveryPersonRepository } from "../../src/infraestructure/repository/deliveryPersonRepository";
import { DeliveryPersonRepositoryInMemory } from "../../src/infraestructure/repository/deliveryPersonRepositoryInMemory";

describe("Testing RegisterDeliveryPerson", () => {
    let deliveryPersonRepository: DeliveryPersonRepository =
        new DeliveryPersonRepositoryInMemory();
    let deliveryPerson: DeliveryPerson;
    test("Must register a delivery person", async () => {
        const registerDeliveryPerson = new RegisterDeliveryPerson(
            deliveryPersonRepository
        );
        const command = {
            fullName: "Teste",
            phoneNumber: "5586911112222",
            plainPassword: "P@ssword#123",
            email: "teste@teste.com",
        };
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
        const registerDeliveryPerson = new RegisterDeliveryPerson(
            deliveryPersonRepository
        );
        const command = {
            fullName: "Teste",
            phoneNumber: "86911112222",
            plainPassword: "P@ssword#123",
            email: "teste@teste.com",
        };
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidPhoneNumberError);
    });

    test("Must not register a delivery person with invalid email", async () => {
        const registerDeliveryPerson = new RegisterDeliveryPerson(
            deliveryPersonRepository
        );
        const command = {
            fullName: "Teste",
            phoneNumber: "5586911112222",
            plainPassword: "P@ssword#123",
            email: "teste@com",
        };
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidEmailError);
    });

    test("Must not register a delivery person with invalid password", async () => {
        const registerDeliveryPerson = new RegisterDeliveryPerson(
            deliveryPersonRepository
        );
        const command = {
            fullName: "Teste",
            phoneNumber: "5586911112222",
            plainPassword: "P@sswo",
            email: "teste@teste.com",
        };
        expect(async () => {
            await registerDeliveryPerson.excute(command);
        }).rejects.toThrow(InvalidPasswordError);
    });
});
