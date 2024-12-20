import { Email, InvalidEmailError } from "../src/domain/value_object/email";

describe("Testing Email", () => {
    test.each([
        "teste@teste.com",
        "user.name@domain.com",
        "user+label@domain.com",
        "123@domain.com",
        "user@sub.domain.com",
    ])("Must create a valid email", (emailAddress) => {
        const email = new Email(emailAddress);
        expect(email.getValue()).toBe(emailAddress);
    });

    test.each([
        "teste@teste",
        "@domain.com",
        "user@.com",
        "user@domain.",
        "user@domain",
        "user domain@com",
        "",
        "user@@domain.com",
        "@",
    ])("Must not create an email with invalid format", (invalidEmail) => {
        expect(() => new Email(invalidEmail)).toThrow(InvalidEmailError);
    });
});
