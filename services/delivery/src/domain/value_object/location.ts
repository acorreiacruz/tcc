export class Location {
    private static EarthRadius = 6371;
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

    static getDistance(from: Location, to: Location): number {
        const startLatitudeInRadians = (from.getLatitude() * Math.PI) / 180;
        const endLatitudeInRadians = (to.getLatitude() * Math.PI) / 180;
        const latitudeDifferenceInRadians =
            ((to.getLatitude() - from.getLatitude()) * Math.PI) / 180;
        const longitudeDifferenceInRadians =
            ((to.getLongitude() - from.getLongitude()) * Math.PI) / 180;
        const haversineFormula =
            Math.sin(latitudeDifferenceInRadians / 2) *
                Math.sin(latitudeDifferenceInRadians / 2) +
            Math.cos(startLatitudeInRadians) *
                Math.cos(endLatitudeInRadians) *
                Math.sin(longitudeDifferenceInRadians / 2) *
                Math.sin(longitudeDifferenceInRadians / 2);
        const angularDistanceInRadians =
            2 *
            Math.atan2(
                Math.sqrt(haversineFormula),
                Math.sqrt(1 - haversineFormula)
            );
        return Location.EarthRadius * angularDistanceInRadians;
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
