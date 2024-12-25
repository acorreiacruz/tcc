export class DeliveryAlreadyStartedError extends Error {
    constructor() {
        super("Delivery already started");
        this.name = "DeliveryAlreadyStartedError";
    }
}

export class DeliveryPersonDoesNotMatchError extends Error {
    constructor() {
        super("Delivery person does not match");
        this.name = "DeliveryPersonDoesNotMatchError";
    }
}

export class DeliveryAlreadyConcludedError extends Error {
    constructor() {
        super("Delivery already concluded");
        this.name = "DeliveryAlreadyConcludedError";
    }
}
