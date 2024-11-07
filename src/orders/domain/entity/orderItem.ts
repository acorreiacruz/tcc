export default class OrderItem {
    private itemId: string;
    private quantity: number;
    private price: number;
    constructor(itemId: string, quantity: number, price: number) {
        if (price <= 0)
            throw new Error(
                "Invalid price value. The value must be a positive number"
            );
        if (quantity <= 0)
            throw new Error(
                "Invalid quantity value. The value must be a positivie number"
            );
        this.itemId = itemId;
        this.quantity = quantity;
        this.price = price;
    }

    getSubTotal(): number {
        return this.price * this.quantity;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getPrice(): number {
        return this.price;
    }
}
