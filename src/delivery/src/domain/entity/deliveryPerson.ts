import { Email } from "../value_object/email";
import { PhoneNumber } from "../value_object/phoneNumber";
import { Location } from "../value_object/location";
import { Password } from "../value_object/password";
import crypto from "crypto";

export class DeliveryPerson {
    private id: string;
    private fullName: string;
    private email: Email;
    private phoneNumber: PhoneNumber;
    private password: Password;
    private status: DeliveryPersonStatus;
    private currentLocation?: Location;
    private constructor(
        id: string,
        fullName: string,
        phoneNumber: PhoneNumber,
        email: Email,
        password: Password,
        status: DeliveryPersonStatus,
        currentLocation?: Location
    ) {
        this.id = id;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.email = email;
        this.currentLocation = currentLocation;
        this.status = status;
    }

    getId(): string {
        return this.id;
    }

    getFullName(): string {
        return this.fullName;
    }

    getPhoneNumber(): string {
        return this.phoneNumber.getValue();
    }

    getPassword(): string {
        return this.password.getValue();
    }

    getStatus(): string {
        return this.status;
    }

    getLocation(): Location | undefined {
        return this.currentLocation;
    }

    getEmail(): string {
        return this.email.getValue();
    }

    startAcceptingDeliveries(): void {
        this.status = "available";
    }

    startDelivery(): void {
        if (this.status === "offline")
            throw new InvalidTransitionToOnDeliveryError();
        this.status = "on_delivery";
    }

    goOffDuty(): void {
        if (this.status === "on_delivery")
            throw new InvalidTransitionToOfflineError();
        this.status = "offline";
    }

    updateLocation(location: Location): void {
        this.currentLocation = location;
    }

    async update(
        fullName?: string,
        email?: string,
        plainPassword?: string,
        phoneNumber?: string
    ): Promise<void> {
        this.fullName = fullName ?? this.fullName;
        this.email = email ? new Email(email) : this.email;
        this.phoneNumber = phoneNumber
            ? new PhoneNumber(phoneNumber)
            : this.phoneNumber;
        this.password = plainPassword
            ? await Password.create(plainPassword)
            : this.password;
    }

    static async create(
        fullName: string,
        emailStr: string,
        phoneNumberStr: string,
        plainPassword: string
    ): Promise<DeliveryPerson> {
        const id = crypto.randomUUID();
        const password = await Password.create(plainPassword);
        const email = new Email(emailStr);
        const phoneNumber = new PhoneNumber(phoneNumberStr);
        const status: DeliveryPersonStatus = "offline";
        return new DeliveryPerson(
            id,
            fullName,
            phoneNumber,
            email,
            password,
            status
        );
    }

    static restore(
        id: string,
        fullName: string,
        email: string,
        phoneNumber: string,
        password: string,
        status: DeliveryPersonStatus,
        currentLocation?: Location
    ): DeliveryPerson {
        return new DeliveryPerson(
            id,
            fullName,
            PhoneNumber.restore(phoneNumber),
            Email.restore(email),
            Password.restore(password),
            status,
            currentLocation
        );
    }

    toJSON(): any {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email.getValue(),
            phoneNumber: this.phoneNumber.getValue(),
            status: this.status,
            currentLocation: this.currentLocation?.toJSON(),
        };
    }
}

export type DeliveryPersonStatus = "available" | "offline" | "on_delivery";

export class InvalidTransitionToOnDeliveryError extends Error {
    constructor() {
        super(
            "It is impossible change the status from 'offline' to 'on_delivery'"
        );
        this.name = "InvalidTransitionToOnDeliveryError";
    }
}

export class InvalidTransitionToOfflineError extends Error {
    constructor() {
        super(
            "It is impossible change the status from 'on_delivery' to 'offline'"
        );
        this.name = "InvalidTransitionToOfflineError";
    }
}
