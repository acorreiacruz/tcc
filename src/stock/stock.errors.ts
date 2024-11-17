export class NegativeStockError extends Error {
    constructor(field: string) {
        super(
            `The Stock ${field} cannot be negative. Ensure the ${field} is greather than or equal to zero`
        );
        this.name = "NegativeStockError";
    }
}

export class ReservedStockExceedsTotalError extends Error {
    constructor() {
        super(
            `The reserved stock quantity cannot exceed the total stock quantity. Ensure the reserved quantity is less than or equal to the total available stock`
        );
        this.name = "ReservedStockExceedsTotalError";
    }
}

