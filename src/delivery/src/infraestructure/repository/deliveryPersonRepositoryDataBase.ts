import { PrismaClient } from "../../../prisma/prisma-client";
import PrismaClientSingleton from "../../../prisma/prismaClientSingleton";
import {
    DeliveryPerson,
    DeliveryPersonStatus,
} from "../../domain/entity/deliveryPerson";
import {
    DeliveryPersonNotFoundError,
    DeliveryPersonRepository,
    NotAvailableDeliveryPersonsError,
} from "./deliveryPersonRepository";
import { Location } from "../../domain/value_object/location";
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
        if (deliveryPersonsData.length === 0)
            throw new NotAvailableDeliveryPersonsError();
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
            include: {
                currentLocation: true,
            },
        });
        if (!deliveryPerson) throw new DeliveryPersonNotFoundError();
        return DeliveryPerson.restore(
            deliveryPerson.id,
            deliveryPerson.fullName,
            deliveryPerson.email,
            deliveryPerson.phoneNumber,
            deliveryPerson.passwordHash,
            deliveryPerson.status as DeliveryPersonStatus,
            deliveryPerson.currentLocation
                ? new Location(
                      deliveryPerson.currentLocation.latitude,
                      deliveryPerson.currentLocation.longitude
                  )
                : undefined
        );
    }

    async update(deliveryPerson: DeliveryPerson): Promise<any> {
        const updateData: any = {
            fullName: deliveryPerson.getFullName(),
            email: deliveryPerson.getEmail(),
            phoneNumber: deliveryPerson.getPhoneNumber(),
            passwordHash: deliveryPerson.getPassword(),
            status: deliveryPerson.getStatus(),
        };

        if (deliveryPerson.getLocation()) {
            updateData.currentLocation = {
                upsert: {
                    create: {
                        latitude: deliveryPerson.getLocation()?.getLatitude(),
                        longitude: deliveryPerson.getLocation()?.getLongitude(),
                    },
                    update: {
                        latitude: deliveryPerson.getLocation()?.getLatitude(),
                        longitude: deliveryPerson.getLocation()?.getLongitude(),
                    },
                },
            };
        }

        return this.dbClient.deliveryPerson.update({
            where: {
                id: deliveryPerson.getId(),
            },
            data: updateData,
        });
    }

    create(deliveryPerson: DeliveryPerson): Promise<any> {
        const createData: any = {
            id: deliveryPerson.getId(),
            fullName: deliveryPerson.getFullName(),
            email: deliveryPerson.getEmail(),
            phoneNumber: deliveryPerson.getPhoneNumber(),
            passwordHash: deliveryPerson.getPassword(),
            status: deliveryPerson.getStatus(),
        };
        if (deliveryPerson.getLocation()) {
            createData.currentLocation = {
                create: {
                    latitude: deliveryPerson.getLocation()?.getLatitude(),
                    longitude: deliveryPerson.getLocation()?.getLongitude(),
                },
            };
        }
        return this.dbClient.deliveryPerson.create({
            data: createData,
        });
    }
}
