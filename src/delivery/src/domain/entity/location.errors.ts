export class InvalidLatitudeError extends Error {
    constructor() {
        super("Invalid latitude value");
        this.name = "InvalidLatitudeError";
    }
}

export class InvalidLongitudeError extends Error {
    constructor() {
        super("Invalid longitude value");
        this.name = "InvalidLongitudeError";
    }
}
