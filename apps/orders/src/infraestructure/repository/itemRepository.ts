import Item from "../../domain/entity/item";

export interface ItemRepository {
    create(item: Item): Promise<void>;
    getByIds(itemIds: string[]): Promise<Item[]>;
}

export class ItemsNotFoundError extends Error {
    constructor() {
        super("There is no item with this ids");
        this.name = "ItemsNotFoundError";
    }
}
