import {
    DeliveryPerson,
    InvalidTransitionToOnDeliveryError,
    InvalidTransitionToOfflineError,
} from "../src/domain/entity/deliveryPerson";
import { Location } from "../src/domain/value_object/location";
import { InvalidEmailError } from "../src/domain/value_object/email";
import { InvalidPhoneNumberError } from "../src/domain/value_object/phoneNumber";

describe("Testing DeliveryPerson", () => {
    const deliveryPersonData = {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "5586911112222",
        plainPassword: "P@ass#1234",
    };

    test("Must create a DeliveryPerson with initial offline status", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        expect(deliveryPerson.getId()).toBeDefined();
        expect(deliveryPerson.getFullName()).toBe(deliveryPersonData.fullName);
        expect(deliveryPerson.getEmail()).toBe(deliveryPersonData.email);
        expect(deliveryPerson.getPhoneNumber()).toBe(
            deliveryPersonData.phoneNumber
        );
        expect(deliveryPerson.getStatus()).toBe("offline");
        expect(deliveryPerson.getLocation()).toBeUndefined();
    });

    test("Must update DeliveryPerson information", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        const newData = {
            fullName: "John Smith",
            email: "john.smith@example.com",
            phoneNumber: "5586933334444",
            plainPassword: "New@Pass123",
        };

        await deliveryPerson.update(
            newData.fullName,
            newData.email,
            newData.plainPassword,
            newData.phoneNumber
        );

        expect(deliveryPerson.getFullName()).toBe(newData.fullName);
        expect(deliveryPerson.getEmail()).toBe(newData.email);
        expect(deliveryPerson.getPhoneNumber()).toBe(newData.phoneNumber);
    });

    test("Must update DeliveryPerson location", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        const location = new Location(-5.091944, -42.803889);
        deliveryPerson.updateLocation(location);

        expect(deliveryPerson.getLocation()).toEqual(location);
    });

    test("Must start accepting deliveries", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        deliveryPerson.startAcceptingDeliveries();
        expect(deliveryPerson.getStatus()).toBe("available");
    });

    test("Must go off duty", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        deliveryPerson.startAcceptingDeliveries();
        deliveryPerson.goOffDuty();
        expect(deliveryPerson.getStatus()).toBe("offline");
    });

    test("Must start delivery when available", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        deliveryPerson.startAcceptingDeliveries();
        deliveryPerson.startDelivery();
        expect(deliveryPerson.getStatus()).toBe("on_delivery");
    });

    test("Must not start delivery when offline", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        expect(() => {
            deliveryPerson.startDelivery();
        }).toThrow(InvalidTransitionToOnDeliveryError);
        expect(deliveryPerson.getStatus()).toBe("offline");
    });

    test("Must allow complete status workflow", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        expect(deliveryPerson.getStatus()).toBe("offline");

        deliveryPerson.startAcceptingDeliveries();
        expect(deliveryPerson.getStatus()).toBe("available");

        deliveryPerson.startDelivery();
        expect(deliveryPerson.getStatus()).toBe("on_delivery");

        deliveryPerson.startAcceptingDeliveries();
        expect(deliveryPerson.getStatus()).toBe("available");

        deliveryPerson.goOffDuty();
        expect(deliveryPerson.getStatus()).toBe("offline");
    });

    test("Must update only provided fields", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        const originalEmail = deliveryPerson.getEmail();
        const originalPhone = deliveryPerson.getPhoneNumber();

        await deliveryPerson.update("New Name");

        expect(deliveryPerson.getFullName()).toBe("New Name");
        expect(deliveryPerson.getEmail()).toBe(originalEmail);
        expect(deliveryPerson.getPhoneNumber()).toBe(originalPhone);
    });

    test("Must not create DeliveryPerson with invalid email", async () => {
        await expect(
            DeliveryPerson.create(
                deliveryPersonData.fullName,
                "invalid-email",
                deliveryPersonData.phoneNumber,
                deliveryPersonData.plainPassword
            )
        ).rejects.toThrow(InvalidEmailError);
    });

    test("Must not create DeliveryPerson with invalid phone number", async () => {
        await expect(
            DeliveryPerson.create(
                deliveryPersonData.fullName,
                deliveryPersonData.email,
                "12345",
                deliveryPersonData.plainPassword
            )
        ).rejects.toThrow(InvalidPhoneNumberError);
    });

    test("Must not update DeliveryPerson with invalid email", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        await expect(
            deliveryPerson.update(undefined, "invalid-email")
        ).rejects.toThrow(InvalidEmailError);
    });

    test("Must not update DeliveryPerson with invalid phone number", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        await expect(
            deliveryPerson.update(undefined, undefined, undefined, "12345")
        ).rejects.toThrow(InvalidPhoneNumberError);
    });

    test("Must not go offline when on delivery", async () => {
        const deliveryPerson = await DeliveryPerson.create(
            deliveryPersonData.fullName,
            deliveryPersonData.email,
            deliveryPersonData.phoneNumber,
            deliveryPersonData.plainPassword
        );

        deliveryPerson.startAcceptingDeliveries();
        deliveryPerson.startDelivery();

        expect(() => {
            deliveryPerson.goOffDuty();
        }).toThrow(InvalidTransitionToOfflineError);
        expect(deliveryPerson.getStatus()).toBe("on_delivery");
    });
});
