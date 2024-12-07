
export class Location {
    private latitude: number;
    private longitude: number;
    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}
