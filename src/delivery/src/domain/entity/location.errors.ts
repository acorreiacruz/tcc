export class InvalidLatitudeError extends Error {
    constructor() {
        super("Invalid latitude value");
        this.name = "InvalidLatitudeError";
    }
}

