import crypto from "crypto";

export default class Item {
    private itemId: string;
    private name: string;
    private description: string;
    private price: number;

    constructor(
        itemId: string,
        name: string,
        description: string,
        price: number
    ) {
        if (name.length > 150)
            throw new Error("Item name has a maximum of 150 characters");
        if (price <= 0)
            throw new Error(
                "The item price must be a strictly positive number"
            );
        if (description.length > 300) {
            throw new Error("Item description has a maximum of 300 characters");
        }
        this.itemId = itemId;
        this.price = price;
        this.name = name;
        this.description = description;
    }

    getName(): string {
        return this.name;
    }

    getPrice(): number {
        return this.price;
    }

    getId(): string {
        return this.itemId;
    }

    getDescription(): string {
        return this.description;
    }

    static create(name: string, description: string, price: number): Item {
        return new Item(crypto.randomUUID(), name, description, price);
    }

    static restore(
        itemId: string,
        name: string,
        description: string,
        price: number
    ): Item {
        return new Item(itemId, name, description, price);
    }

    toJSON(): Object {
        return {
            itemId: this.itemId,
            name: this.name,
            description: this.description,
            price: this.price,
        };
    }
}
