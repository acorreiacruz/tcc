import { Location } from "../src/domain/entity/location";
describe("Testing Location", () => {
    let location: Location;
    let latitude: number = -5.097822;
    let longitude: number = -42.806155;
    test("Must create a Location", () => {
        location = new Location(latitude, longitude);
        expect(location.getLatitude()).toBe(latitude);
        expect(location.getLongitude()).toBe(longitude);
    });
});
