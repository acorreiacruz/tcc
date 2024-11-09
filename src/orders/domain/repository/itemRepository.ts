import Item from "../entity/item";

export default interface ItemRepository {
    create(item: Item): Promise<void>;
    getByIds(itemIds: string[]): Promise<Item[]>;
}
