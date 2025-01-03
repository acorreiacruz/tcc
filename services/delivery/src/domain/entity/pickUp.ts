export class Pickup {
    
    private id: string;
    private pickedUpAt?: Date;
    private customerId: string;
    private orderId: string;
    private attemps: number;
    private status: PickupStatus;
    constructor(
        id: string,
        customerId: string,
        orderId: string,
        attempts: number,
        status: PickupStatus,
        pickedUpAt?: Date
    ) {
        this.id = id;
        this.customerId = customerId;
        this.orderId = orderId;
        this.attemps = attempts;
        this.status = status;
        this.pickedUpAt = pickedUpAt;
    }

    conclude(pickedUpAt: Date): void {
        this.status = "pickedUp";
        this.pickedUpAt = pickedUpAt;
    }

    fail(): void {
        this.status = "failed";
        this.attemps += 1;
    }
}

export type PickupStatus = "pickedUp" | "failed";
