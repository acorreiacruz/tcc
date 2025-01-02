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

export class UnavailableDeliveryPersonsError extends Error {
    constructor() {
        super("There is no available delivery person");
        this.name = "UnavailableDeliveryPersonsError";
    }
}

export class DeliveryAlreadyAssignedError extends Error {
    constructor() {
        super("This delivery already had been assigned");
        this.name = "DeliveryAlreadyAssignedError";
    }
}

export class UnableToAssignDeliveryError extends Error {
    constructor() {
        super("Unable to assign delivery to a delivery person");
        this.name = "UnableToAssignDeliveryError";
    }
}
