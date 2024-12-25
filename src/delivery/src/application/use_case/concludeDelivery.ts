import { Delivery } from "../../domain/entity/delivery";
import { DeliveryPerson } from "../../domain/entity/deliveryPerson";
import DeliveryConcluded from "../../domain/event/deliveryConcluded";
import UnitOfWork from "../../infraestructure/unitOfWork";
import {
    DeliveryAlreadyConcludedError,
    DeliveryPersonDoesNotMatchError,
} from "./errors";

export class ConcludeDelivery {
    constructor(private unitOfWork: UnitOfWork) {}

    async execute(command: ConcludeDeliveryCommand): Promise<void> {
        const delivery: Delivery = await this.unitOfWork.delivery.getById(
            command.deliveryId
        );
        if (delivery.getDeliveryPersonId() !== command.deliveryPersonId)
            throw new DeliveryPersonDoesNotMatchError();
        if (delivery.getStatus() === "concluded")
            throw new DeliveryAlreadyConcludedError();
        const deliveryPerson: DeliveryPerson =
            await this.unitOfWork.deliveryPerson.getById(
                command.deliveryPersonId
            );
        delivery.conclude(command.concludedAt);
        deliveryPerson.startAcceptingDeliveries();
        await this.unitOfWork.execute([
            this.unitOfWork.deliveryPerson.update(deliveryPerson),
            this.unitOfWork.delivery.update(delivery),
            this.unitOfWork.outbox.create(DeliveryConcluded.create(delivery)),
        ]);
    }
}

export type ConcludeDeliveryCommand = {
    deliveryId: string;
    deliveryPersonId: string;
    concludedAt: Date;
};
