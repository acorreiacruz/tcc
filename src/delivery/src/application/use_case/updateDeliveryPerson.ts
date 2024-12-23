import { DeliveryPerson } from "../../domain/entity/deliveryPerson";
import { DeliveryPersonRepository } from "../../infraestructure/repository/deliveryPersonRepository";

export class UpdateDeliveryPerson {
    constructor(
        private readonly deliveryPersonRepository: DeliveryPersonRepository
    ) {}
    async excute(command: UpdateDeliveryPersonCommand): Promise<UpdateDeliveryPersonOutput> {
        const deliveryPerson: DeliveryPerson =
            await this.deliveryPersonRepository.getById(
                command.deliveryPersonId
            );
        await deliveryPerson.update(
            command.fullName,
            command.email,
            command.plainPassword,
            command.phoneNumber
        );
        await this.deliveryPersonRepository.update(deliveryPerson);
        return {
            id: deliveryPerson.getId(),
            fullName: deliveryPerson.getFullName(),
            email: deliveryPerson.getEmail(),
            phoneNumber: deliveryPerson.getPhoneNumber(),
            status: deliveryPerson.getStatus(),
        };
    }
}

export type UpdateDeliveryPersonCommand = {
    deliveryPersonId: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    plainPassword?: string;
};

export type UpdateDeliveryPersonOutput = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
};
