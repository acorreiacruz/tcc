import { Delivery } from "../../domain/entity/delivery";
import DeliveryFailed from "../../domain/event/deliveryFailed";
import UnitOfWork from "../../infraestructure/unitOfWork";
import { DeliveryPersonDoesNotMatchError } from "./errors";

export default class FailDelivery {
    constructor(private readonly unitOfWork: UnitOfWork) {}

    async execute(command: FailDeliveryCommand): Promise<void> {
        const delivery: Delivery = await this.unitOfWork.delivery.getById(
            command.deliveryId
        );
        if (delivery.getDeliveryPersonId() !== command.deliveryPersonId) {
            throw new DeliveryPersonDoesNotMatchError();
        }
        delivery.fail();
        await this.unitOfWork.execute([
            this.unitOfWork.delivery.update(delivery),
            this.unitOfWork.outbox.create(DeliveryFailed.create(delivery)),
        ]);
    }
}

type FailDeliveryCommand = {
    deliveryId: string;
    deliveryPersonId: string;
};
