import { PrismaClient } from "../../../prisma/prisma-client";
import PrismaClientSingleton from "../../../prisma/prismaClientSingleton";
import { DeliveryPerson, DeliveryPersonStatus } from "../../domain/entity/deliveryPerson";
import {
    DeliveryPersonNotFoundError,
    DeliveryPersonRepository,
} from "./deliveryPersonRepository";

export class DeliveryPersonRepositoryDataBase
    implements DeliveryPersonRepository
{
    private dbClient: PrismaClient;
    constructor() {
        this.dbClient = PrismaClientSingleton.getInstance();
    }

    async getByStatus(status: DeliveryPersonStatus): Promise<DeliveryPerson[]> {
        const deliveryPersonsData = await this.dbClient.deliveryPerson.findMany(
            {
                where: {
                    status: status,
                },
            }
        );
        return deliveryPersonsData.map((deliveryPersonData) => {
            return DeliveryPerson.restore(
                deliveryPersonData.id,
                deliveryPersonData.fullName,
                deliveryPersonData.email,
                deliveryPersonData.phoneNumber,
                deliveryPersonData.passwordHash,
                deliveryPersonData.status as DeliveryPersonStatus
            );
        });
    }

    async getById(deliveryPersonId: string): Promise<DeliveryPerson> {
        const deliveryPerson = await this.dbClient.deliveryPerson.findUnique({
            where: {
                id: deliveryPersonId,
            },
        });
        if (!deliveryPerson) throw new DeliveryPersonNotFoundError();
        return DeliveryPerson.restore(
            deliveryPerson.id,
            deliveryPerson.fullName,
            deliveryPerson.email,
            deliveryPerson.phoneNumber,
            deliveryPerson.passwordHash,
            deliveryPerson.status as DeliveryPersonStatus
        );
    }

    update(deliveryPerson: DeliveryPerson): Promise<any> {
        return this.dbClient.deliveryPerson.update({
            where: {
                id: deliveryPerson.getId(),
            },
            data: {
                fullName: deliveryPerson.getFullName(),
                email: deliveryPerson.getEmail(),
                phoneNumber: deliveryPerson.getPhoneNumber(),
                passwordHash: deliveryPerson.getPassword(),
                status: deliveryPerson.getStatus(),
            },
        });
    }

    create(deliveryPerson: DeliveryPerson): Promise<any> {
        return this.dbClient.deliveryPerson.create({
            data: {
                id: deliveryPerson.getId(),
                fullName: deliveryPerson.getFullName(),
                email: deliveryPerson.getEmail(),
                phoneNumber: deliveryPerson.getPhoneNumber(),
                passwordHash: deliveryPerson.getPassword(),
                status: deliveryPerson.getStatus(),
            },
        });
    }
}
