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

export class InsufficientStockForReservationError extends Error {
    constructor() {
        super(
            `Unable to reserve stock for the item. Insufficient quantity available to fulfill the reservation request`
        );
        this.name = "InsufficientStockForReservationError";
    }
}

export class InvalidStockReservationQuantityError extends Error {
    constructor() {
        super("The quantity to be reserved must be greater than zero");
        this.name = "InvalidStockReservationQuantityError";
    }
}

export class InvalidStockConfirmationQuantityError extends Error {
    constructor() {
        super(
            "The quantity to be confirmed in stock must be greater than zero"
        );
        this.name = "InvalidStockConfirmationQuantityError";
    }
}

export class ExcessiveStockConfirmationError extends Error {
    constructor() {
        super(
            "The stock confirmation quantity cannot be greater than the total stock quantity or the reserved quantity"
        );
        this.name = "ExcessiveStockConfirmationError";
    }
}

export class InvalidStockReleaseQuantityError extends Error {
    constructor() {
        super(
            "The quantity to be released in stock must be greater than zero"
        );
        this.name = "InvalidStockReleaseQuantityError";
    }
}
