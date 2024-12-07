import { Location } from "../src/domain/entity/location";

describe("Test Delivery", () => {
    let orderId: string = "b950de87-a253-4766-bb02-e3bbdc11861a";
    let location: Location = new Location(35.78, 45.98);
    let deliveryPersonId: string = "ba9c6901-d438-49fb-847a-dffd39ead777";
    test("Must create a Delivery", () => {
        delivery = Delivery.create(orderId, location);
        expect(delivery.getAttempts()).toBe(0);
        expect(delivery.getStatus()).toBe("on_hold");
        expect(delivery.getDeliveryPersonId()).toBeUndefined();
        expect(delivery.getStartedAt()).toBeUndefined();
        expect(delivery.getConcludedAt()).toBeUndefined();
        expect(delivery.getLocation()).toEqual(location);
    });

    test("Must update Delivery location", () => {
        delivery = Delivery.create(orderId, location);
        const newLocation = new Location(45.90, 108.89);
        delivery.updateLocation(newLocation);
        expect(delivery.getLocation()).toEqual(newLocation);
    });

    test("Must assign a delivery person to a Delivery", () => {
        delivery = Delivery.create(orderId, location);
        delivery.assign(deliveryPersonId);
        expect(delivery.getStatus()).toBe("assigned");
        expect(delivery.getDeliveryPersonId()).toBe(deliveryPersonId);
    });

});
