import { Delivery, DeliveryStatus } from "../src/domain/entity/delivery";
import {
    InvalidTransitionToAssignedError,
    InvalidTransitionToConcludedError,
    InvalidTransitionToFailedError,
    InvalidTransitionToOutForDeliveryError,
} from "../src/domain/entity/delivery.errors";
import { Location } from "../src/domain/entity/location";

describe("Test Delivery", () => {
    let deliveryId: string = "bc036acb-1221-4c8b-abb0-17bf6e9e11f7";
    let attempts = 0;
    let status: DeliveryStatus = "on_hold";
    let orderId: string = "b950de87-a253-4766-bb02-e3bbdc11861a";
    let location: Location = new Location(35.78, 45.98);
    let startedAt: Date = new Date("2024-12-20T12:00:00");
    let deliveryPersonId: string = "ba9c6901-d438-49fb-847a-dffd39ead777";
    let delivery: Delivery;

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

    test("Must not assign a delivery person to a Delivery that is not 'on_hold'", () => {
        status = "failed";
        delivery = Delivery.restore(
            deliveryId,
            orderId,
            status,
            attempts,
            location
        );
        expect(() => delivery.assign(deliveryPersonId)).toThrow(
            InvalidTransitionToAssignedError
        );
    });

    test("Must start a Delivery", () => {
        status = "assigned";
        delivery = Delivery.restore(
            deliveryId,
            orderId,
            status,
            attempts,
            location
        );
        delivery.start(startedAt);
        expect(delivery.getStartedAt()).toBe(startedAt);
        expect(delivery.getStatus()).toBe("out_for_delivery");
    });

    test("Must not start a Delivery when the status is not 'assigned'", () => {
        status = "failed";
        delivery = Delivery.restore(
            deliveryId,
            orderId,
            status,
            attempts,
            location
        );
        expect(() => delivery.start(startedAt)).toThrow(
            InvalidTransitionToOutForDeliveryError
        );
    });

    test("Must conclude a Delivery", () => {
        status = "out_for_delivery";
        delivery = Delivery.restore(
            deliveryId,
            orderId,
            status,
            attempts,
            location
        );
        delivery.conclude(concludedAt);
        expect(delivery.getConcludedAt()).toBe(concludedAt);
        expect(delivery.getStatus()).toBe("concluded");
    });
});