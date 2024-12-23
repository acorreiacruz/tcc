import { PrismaClient } from "../../../prisma/prisma-client";
import PrismaClientSingleton from "../../../prisma/prismaClientSingleton";
import { Delivery, DeliveryStatus } from "../../domain/entity/delivery";
import {
    DeliveryNotFoundError,
    DeliveryRepository,
} from "./deliveryRepository";
import { Location } from "../../domain/value_object/location";
import DomainEvent from "../../../../common/domainEvent";

export class DeliveryRepositoryDataBase implements DeliveryRepository {
    private dbClient: PrismaClient;
    constructor() {
        this.dbClient = PrismaClientSingleton.getInstance();
    }

    async getById(deliveryId: string): Promise<Delivery> {
        const delivery = await this.dbClient.delivery.findUnique({
            where: {
                id: deliveryId,
            },
            include: {
                deliveryPerson: true,
                location: true,
            },
        });
        if (!delivery) throw new DeliveryNotFoundError();
        return Delivery.restore(
            delivery.id,
            delivery.orderId,
            delivery.status as DeliveryStatus,
            delivery.attempts,
            new Location(
                delivery.location.latitude,
                delivery.location.longitude
            ),
            delivery.deliveryPersonId ?? undefined,
            delivery?.startedAt ?? undefined,
            delivery?.concludedAt ?? undefined
        );
    }

    async create(delivery: Delivery): Promise<void> {
        await this.dbClient.delivery.create({
            data: {
                id: delivery.getId(),
                orderId: delivery.getOrderId(),
                status: delivery.getStatus(),
                attempts: delivery.getAttempts(),
                location: {
                    create: {
                        latitude: delivery.getLocation().getLatitude(),
                        longitude: delivery.getLocation().getLongitude(),
                    },
                },
            },
        });
    }

    async update(delivery: Delivery, event: DomainEvent): Promise<void> {
        const deliveryUpdate = this.dbClient.delivery.update({
            where: {
                id: delivery.getId(),
            },
            data: {
                status: delivery.getStatus(),
                attempts: delivery.getAttempts(),
                startedAt: delivery.getStartedAt() ?? undefined,
                concludedAt: delivery.getConcludedAt() ?? undefined,
                deliveryPerson: {
                    connect: {
                        id: delivery.getDeliveryPersonId() ?? undefined,
                    },
                },
                location: {
                    update: delivery.getLocation().toJSON(),
                },
            },
        });

        const outboxCreation = this.dbClient.deliveryOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event.toJSON()),
            },
        });

        await this.dbClient.$transaction([deliveryUpdate, outboxCreation]);
    }
}
