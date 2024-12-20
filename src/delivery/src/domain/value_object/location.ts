export class Location {
    private latitude: number;
    private longitude: number;
    constructor(latitude: number, longitude: number) {
        if (!Location.isValidLatitude(latitude))
            throw new InvalidLatitudeError();
        if (!Location.isValidLongitude(longitude))
            throw new InvalidLongitudeError();
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    static isValidLatitude(value: number): boolean {
        return value >= -90 && value <= 90;
    }

    static isValidLongitude(value: number): boolean {
        return value >= -180 && value <= 180;
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }

    toJSON(): any {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }
}

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
