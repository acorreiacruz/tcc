import { InvalidPasswordError, Password } from "../src/domain/entity/password";

describe("Testing Password", () => {
    let password: Password;
    let plainPassword: string;

    test("Must validate a strong password value", () => {
        plainPassword = "P@ssword123#";
        expect(Password.isStrong(plainPassword)).toBeTruthy();
    });

    test("Must validate a weak password value", () => {
        plainPassword = "pass123";
        expect(Password.isStrong(plainPassword)).toBeFalsy();
    });

    test("Must create a Password", async () => {
        plainPassword = "P@ssword123#";
        password = await Password.create(plainPassword);
        const isEqual = await Password.isEqual(
            plainPassword,
            password.getValue()
        );
        expect(isEqual).toBeTruthy();
    });

    test("Must not create a invalid Password", async () => {
        plainPassword = "password";
        expect(
            async () => await Password.create(plainPassword)
        ).rejects.toThrow(InvalidPasswordError);
    });
});
