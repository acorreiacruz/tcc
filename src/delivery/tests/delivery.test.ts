import { Location } from "../src/domain/entity/location";

describe("Test Delivery", () => {
    let orderId: string = "b950de87-a253-4766-bb02-e3bbdc11861a";
    let location: Location = new Location(35.78, 45.98);
    test("Must create a Delivery", () => {
        delivery = Delivery.create(orderId, location);
        expect(delivery.getAttempts()).toBe(0);
        expect(delivery.getStatus()).toBe("on_hold");
        expect(delivery.getDeliveryPersonId()).toBeUndefined();
        expect(delivery.getStartedAt()).toBeUndefined();
        expect(delivery.getConcludedAt()).toBeUndefined();
        expect(delivery.getLocation()).toEqual(location);
    });
});
