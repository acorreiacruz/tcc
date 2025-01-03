import Item from "../../domain/entity/item";

export default interface ItemRepository {
    create(item: Item): Promise<void>;
    getByIds(itemIds: string[]): Promise<Item[]>;
}
