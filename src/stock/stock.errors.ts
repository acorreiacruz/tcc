export class NegativeStockError extends Error {
    constructor(field: string) {
        super(
            `The Stock ${field} cannot be negative. Ensure the ${field} is greather than or equal to zero`
        );
        this.name = "NegativeStockError";
    }
}

