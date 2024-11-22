export class OrderConfirmTransitionError extends Error{
    constructor() {
        super("It is only possible confirm a order that is 'pending'");
        this.name = "OrderConfirmTransitionError";
    }
}

export class OrderAlreadyConfirmedError extends Error {
    constructor() {
        super(`This order has already been confirmed`);
        this.name = "OrderAlreadyConfirmedError";
    }
}
