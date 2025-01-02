export class Address {
    static validStates = ["PI", "MA", "CE"];
    private street: string;
    private number: string;
    private neighborhood: string;
    private zipCode: string;
    private city: string;
    private state: string;
    constructor(
        street: string,
        number: string,
        neighborhood: string,
        zipCode: string,
        city: string,
        state: string
    ) {
        if (!Address.validStates.includes(state)) throw new InvalidStateError();
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.zipCode = zipCode;
        this.city = city;
        this.state = state;
    }

    toString(): string {
        return `${this.street}, ${this.number}-${this.neighborhood}, ${this.city}-${this.state}, ${this.zipCode}`;
    }
}

export class InvalidStateError extends Error {
    constructor() {
        super("Invalid state");
        this.name = "InvalidStateError";
    }
}
