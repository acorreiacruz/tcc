import { DeliveryPerson } from "../../domain/entity/deliveryPerson";
import { DeliveryPersonRepository } from "../../infraestructure/repository/deliveryPersonRepository";

export class RegisterDeliveryPerson {
    constructor(
        private readonly deliveryPersonRepository: DeliveryPersonRepository
    ) {}
    async excute(
        command: RegisterDeliveryPersonCommand
    ): Promise<RegisterDeliveryPersonOutput> {
        const deliveryPerson: DeliveryPerson = await DeliveryPerson.create(
            command.fullName,
            command.email,
            command.phoneNumber,
            command.plainPassword
        );
        await this.deliveryPersonRepository.create(deliveryPerson);
        return {
            id: deliveryPerson.getId(),
            fullName: deliveryPerson.getFullName(),
            phoneNumber: deliveryPerson.getPhoneNumber(),
            email: deliveryPerson.getEmail(),
            status: deliveryPerson.getStatus(),
        };
    }
}

export type RegisterDeliveryPersonCommand = {
    fullName: string;
    phoneNumber: string;
    plainPassword: string;
    email: string;
};

export type RegisterDeliveryPersonOutput = {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    status: string;
};
