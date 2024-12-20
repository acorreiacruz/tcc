import {
    InvalidTransitionToAssignedError,
    InvalidTransitionToConcludedError,
    InvalidTransitionToFailedError,
    InvalidTransitionToOutForDeliveryError,
} from "./delivery.errors";
import { Location } from "./location";
import crypto from "crypto";

export type DeliveryStatus =
    | "out_for_delivery"
    | "concluded"
    | "failed"
    | "assigned"
    | "on_hold";

export class Delivery {
    private id: string;
    private orderId: string;
    private status: DeliveryStatus;
    private attempts: number;
    private location: Location;
    private deliveryPersonId?: string;
    private startedAt?: Date;
    private concludedAt?: Date;
    private constructor(
        id: string,
        orderId: string,
        status: DeliveryStatus,
        attempts: number,
        location: Location,
        deliveryPersonId?: string,
        startedAt?: Date,
        concludedAt?: Date
    ) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.attempts = attempts;
        this.location = location;
        this.deliveryPersonId = deliveryPersonId;
        this.startedAt = startedAt;
        this.concludedAt = concludedAt;
    }

    getDeliveryPersonId(): string | undefined {
        return this.deliveryPersonId;
    }

    getStartedAt(): Date | undefined {
        return this.startedAt;
    }

    getConcludedAt(): Date | undefined {
        return this.concludedAt;
    }

    getAttempts(): number {
        return this.attempts;
    }

    getId(): string {
        return this.id;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getStatus(): DeliveryStatus {
        return this.status;
    }

    updateLocation(location: Location): void {
        this.location = location;
    }

    getLocation(): Location {
        return this.location;
    }

    conclude(concludedAt: Date) {
        if (this.status !== "out_for_delivery")
            throw new InvalidTransitionToConcludedError();
        this.concludedAt = concludedAt;
        this.status = "concluded";
    }

    start(startedAt: Date) {
        if (this.status !== "assigned")
            throw new InvalidTransitionToOutForDeliveryError();
        this.startedAt = startedAt;
        this.status = "out_for_delivery";
    }

    fail(): void {
        if (this.status !== "out_for_delivery")
            throw new InvalidTransitionToFailedError();
        this.status = "failed";
        this.attempts += 1;
    }

    assign(deliveryPersonId: string): void {
        if (this.status != "on_hold")
            throw new InvalidTransitionToAssignedError();
        this.deliveryPersonId = deliveryPersonId;
        this.status = "assigned";
    }

    static create(orderId: string, location: Location): Delivery {
        const id = crypto.randomUUID();
        const status: DeliveryStatus = "on_hold";
        const attempts = 0;
        return new Delivery(id, orderId, status, attempts, location);
    }

    static restore(
        id: string,
        orderId: string,
        status: DeliveryStatus,
        attempts: number,
        location: Location,
        deliveryPersonId?: string,
        startedAt?: Date,
        concludedAt?: Date
    ): Delivery {
        return new Delivery(
            id,
            orderId,
            status,
            attempts,
            location,
            deliveryPersonId,
            startedAt,
            concludedAt
        );
    }

    toJSON(): any {
        return {
            id: this.id,
            orderId: this.orderId,
            status: this.status,
            attempts: this.attempts,
            location: this.location.toJSON(),
            deliveryPersonId: this.deliveryPersonId,
            startedAt: this.startedAt,
            concludedAt: this.concludedAt,
        };
    }
}
