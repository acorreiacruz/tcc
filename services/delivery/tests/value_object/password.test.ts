import {
    InvalidPasswordError,
    Password,
} from "../../src/domain/value_object/password";

describe("Testing Password", () => {
    test.each([
        ["P@ssword123#"],
        ["Senha$2023!"],
        ["Test@1234#"],
        ["C0mpl3x@Pass"],
        ["Sup3r$Str0ng!"],
    ])("Must validate password format", (password) => {
        expect(Password.isStrong(password)).toBeTruthy();
    });

    test.each([
        [""],
        ["P@ss1"],
        ["senha123"],
        ["Senha123"],
        ["Senha@especial"],
        ["senha@123"],
        ["12345@#$%"],
    ])("Must not create a invalid Password", async (password) => {
        expect(async () => await Password.create(password)).rejects.toThrow(
            InvalidPasswordError
        );
    });

    test.each([
        ["P@ssword123#"],
        ["Senha$2023!"],
        ["Test@1234#"],
        ["C0mpl3x@Pass"],
        ["Sup3r$Str0ng!"],
    ])("Must create a Password", async (password) => {
        const passwordCreated = await Password.create(password);
        const isEqual = await Password.isEqual(
            password,
            passwordCreated.getValue()
        );
        expect(isEqual).toBeTruthy();
    });
});
