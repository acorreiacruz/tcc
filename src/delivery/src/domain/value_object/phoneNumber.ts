export class PhoneNumber {
    private static AcceptedCountryCodes = ["55"];
    private phoneNumber: string;
    constructor(phoneNumber: string) {
        if (!PhoneNumber.isValid(phoneNumber))
            throw new InvalidPhoneNumberError();
        this.phoneNumber = phoneNumber;
    }

    static isValid(phoneNumber: string): boolean {
        return (
            phoneNumber.length === 13 &&
            PhoneNumber.AcceptedCountryCodes.includes(
                phoneNumber.substring(0, 2)
            )
        );
    }

    getValue(): string {
        return this.phoneNumber;
    }
}

export class InvalidPhoneNumberError extends Error {
    constructor() {
        super("Invalid phone number");
        this.name = "InvalidPhoneNumberError";
    }
}
