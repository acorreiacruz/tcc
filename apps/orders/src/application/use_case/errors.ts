export class UnauthorizedOrderUpdateError extends Error {
    constructor() {
        super("A user is not allowed to update another user's order");
        this.name = "UnauthorizedOrderUpdateError";
    }
}
