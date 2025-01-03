export class Email {
    private email: string;
    constructor(email: string) {
        if (!Email.isValid(email)) throw new InvalidEmailError();
        this.email = email;
    }

    getValue(): string {
        return this.email;
    }

    static isValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static restore(email: string): Email {
        return new Email(email);
    }
}

export class InvalidEmailError extends Error {
    constructor() {
        super("Invalid email");
        this.name = "InvalidEmailError";
    }
}