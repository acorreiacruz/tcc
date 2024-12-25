import { Delivery } from "../../domain/entity/delivery";

export interface DeliveryRepository {
    getById(deliveryId: string): Promise<Delivery>;
    create(delivery: Delivery): Promise<void>;
    update(delivery: Delivery): Promise<void>;
}


export class DeliveryNotFoundError extends Error {
    constructor() {
        super("Delivery not found");
        this.name = "DeliveryNotFoundError";
    }
}
