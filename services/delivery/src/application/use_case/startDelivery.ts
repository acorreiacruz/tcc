import { Delivery } from "../../domain/entity/delivery";
import { DeliveryPerson } from "../../domain/entity/deliveryPerson";
import DeliveryStarted from "../../domain/event/deliveryStarted";
import UnitOfWork from "../../infraestructure/unitOfWork";
import { DeliveryAlreadyStartedError, DeliveryPersonDoesNotMatchError } from "./errors";

export class StartDelivery {
    constructor(private readonly unitOfWork: UnitOfWork) {}

    async execute(command: StartDeliveryCommand): Promise<void> {
        const delivery: Delivery =
            await this.unitOfWork.delivery.getById(command.deliveryId);
        if (delivery.getDeliveryPersonId() !== command.deliveryPersonId)
            throw new DeliveryPersonDoesNotMatchError();
        if (delivery.getStatus() === "out_for_delivery")
            throw new DeliveryAlreadyStartedError();
        const deliveryPerson: DeliveryPerson =
            await this.unitOfWork.deliveryPerson.getById(
                command.deliveryPersonId
            );
        delivery.start(command.startedAt);
        deliveryPerson.startDelivery();
        await this.unitOfWork.execute([
            this.unitOfWork.deliveryPerson.update(deliveryPerson),
            this.unitOfWork.delivery.update(delivery),
            this.unitOfWork.outbox.create(DeliveryStarted.create(delivery)),
        ]);
    }
}

export type StartDeliveryCommand = {
    deliveryId: string;
    deliveryPersonId: string;
    startedAt: Date;
};
