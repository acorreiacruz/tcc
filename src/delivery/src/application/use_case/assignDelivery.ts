import { Delivery } from "../../domain/entity/delivery";
import { DeliveryPerson } from "../../domain/entity/deliveryPerson";
import DeliveryAssigned from "../../domain/event/deliveryAssigned";
import UnitOfWork from "../../infraestructure/unitOfWork";
import {
    DeliveryAlreadyAssignedError,
    UnableToAssignDeliveryError,
} from "./errors";
import { Location } from "../../domain/value_object/location";

export class AssignDelivery {
    private unitOfWork: UnitOfWork;
    
    constructor(unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async execute(command: AssignDeliveryCommand): Promise<void> {
        const deliveryPersons: DeliveryPerson[] =
            await this.unitOfWork.deliveryPerson.getByStatus("available");
        const delivery: Delivery = await this.unitOfWork.delivery.getById(
            command.deliveryId
        );
        if (delivery.getStatus() === "assigned")
            throw new DeliveryAlreadyAssignedError();
        let lowerDistance = -1;
        let deliveryPersonAssigned: DeliveryPerson | undefined;
        for (const deliveryPerson of deliveryPersons) {
            const deliveryPersonLocation = deliveryPerson.getLocation();
            const deliveryLocation = delivery.getLocation();
            if (!deliveryPersonLocation || !deliveryLocation) continue;
            const distance = Location.getDistance(
                deliveryPersonLocation,
                deliveryLocation
            );
            if (distance < lowerDistance) {
                lowerDistance = distance;
                deliveryPersonAssigned = deliveryPerson;
            }
        }
        if (!deliveryPersonAssigned || lowerDistance === -1)
            throw new UnableToAssignDeliveryError();
        delivery.assign(deliveryPersonAssigned.getId());
        await this.unitOfWork.execute([
            this.unitOfWork.delivery.update(delivery),
            this.unitOfWork.outbox.create(DeliveryAssigned.create(delivery)),
        ]);
    }
}

export type AssignDeliveryCommand = {
    deliveryId: string;
};
