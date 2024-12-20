import { InvalidPhoneNumberError, PhoneNumber } from "../src/domain/value_object/phoneNumber";


describe("Testing PhoneNumber", () => {
    test("Must create a valid phone number", () => {
        const phoneNumber = new PhoneNumber("5586911112222");
        expect(phoneNumber.getValue()).toBe("5586911112222");
    });

    test("Must not create a invalid phone number", () => {
        expect(() => new PhoneNumber("1234567890")).toThrow(InvalidPhoneNumberError);
    });

    test("Must not create a invalid phone number with less than 13 digits", () => {
        expect(() => new PhoneNumber("1234567890")).toThrow(InvalidPhoneNumberError);
    });

    test("Must not create a invalid phone number with more than 13 digits", () => {
        expect(() => new PhoneNumber("123456789012")).toThrow(InvalidPhoneNumberError);
    });

    test("Must not create a invalid phone number with invalid format", () => {
        expect(() => new PhoneNumber("123456789012")).toThrow(InvalidPhoneNumberError);
    }); 
});
