import * as bcrypt from "bcrypt";

export class Password {
    static SaltRounds: number = 10;
    static Format =
        /^(?=.*[A-Z])(?=.*[!@#$)%={+{(&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    private value: string;
    private constructor(value: string) {
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    static isStrong(value: string): boolean {
        return Password.Format.test(value);
    }

    static async hashPassword(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, Password.SaltRounds);
    }

    static async isEqual(
        plainPassword: string,
        passwordHash: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, passwordHash);
    }

    static async create(plainPassword: string): Promise<Password> {
        if (!Password.isStrong(plainPassword)) throw new InvalidPasswordError();
        const passwordHash = await Password.hashPassword(plainPassword);
        return new Password(passwordHash);
    }
}


export class InvalidPasswordError extends Error {
    constructor() {
        super(
            "The password must be at least 8 characters long, including upper and lower case letters, numbers and special characters."
        );
        this.name = "InvalidPasswordError";
    }
}
