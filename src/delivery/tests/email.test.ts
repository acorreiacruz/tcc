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

});
