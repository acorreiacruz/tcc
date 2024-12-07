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

});
