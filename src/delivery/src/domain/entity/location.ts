
export class Location {
    private latitude: number;
    private longitude: number;
    constructor(latitude: number, longitude: number) {
        if (!Location.isValidLatitude(latitude))
            throw new InvalidLatitudeError();
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    static isValidLatitude(value: number): boolean {
        return value >= -90 && value <= 90;
    }
    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}
