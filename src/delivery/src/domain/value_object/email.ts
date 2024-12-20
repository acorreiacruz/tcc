export class Email {
    private email: string;
    constructor(email: string) {
        if (!Email.isValid(email)) throw new InvalidEmailError();
        this.email = email;
    }

    getValue(): string {
        return this.email;
    }

}

