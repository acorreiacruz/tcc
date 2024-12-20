import { Location } from "../../src/domain/value_object/location";
import { InvalidLatitudeError, InvalidLongitudeError } from "../../src/domain/value_object/location";
describe("Testing Location", () => {
    let location: Location;
    let latitude: number = -5.097822;
    let longitude: number = -42.806155;
    test("Must create a Location", () => {
        location = new Location(latitude, longitude);
        expect(location.getLatitude()).toBe(latitude);
        expect(location.getLongitude()).toBe(longitude);
    });

    test("Must not create a Location with invalid latitude value", () => {
        longitude = 150;
        latitude = 91.567;
        expect(() => new Location(latitude, longitude)).toThrow(
            InvalidLatitudeError
        );
    });

    test("Must not create a Location with invalid longitude value", () => {
        latitude = 45.98;
        longitude = 180.567;
        expect(() => new Location(latitude, longitude)).toThrow(
            InvalidLongitudeError
        );
    });
});
