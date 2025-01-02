import {
    DeliveryPerson,
    DeliveryPersonStatus,
} from "../../domain/entity/deliveryPerson";

export interface DeliveryPersonRepository {
    create(deliveryPerson: DeliveryPerson): Promise<void>;
    getByStatus(status: DeliveryPersonStatus): Promise<DeliveryPerson[]>;
    getById(id: string): Promise<DeliveryPerson>;
    update(deliveryPerson: DeliveryPerson): Promise<void>;
}

export class DeliveryPersonNotFoundError extends Error {
    constructor() {
        super("Delivery person not found");
        this.name = "DeliveryPersonNotFoundError";
    }
}

export class NotAvailableDeliveryPersonsError extends Error {
    constructor() {
        super("There is no available delivery persons");
        this.name = "NotAvailableDeliveryPersonsError";
    }
}
