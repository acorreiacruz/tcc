import { PrismaClient } from "../orm/prisma/prisma-client";
import ItemRepository from "./itemRepository";
import Item from "../../domain/entity/item";

export default class ItemRepositoryDatabase implements ItemRepository {
    private client: PrismaClient;
    constructor() {
        this.client = new PrismaClient();
    }
    async create(item: Item): Promise<void> {
        await this.client.item.create({
            data: item.toJSON(),
        });
    }
    async getByIds(itemIds: string[]): Promise<Item[]> {
        const itemsData = await this.client.item.findMany({
            where: {
                itemId: { in: itemIds },
            },
        });
        if (!itemsData)
            throw new Error(`There is no item with this id's: ${itemIds}`);
        const items: Item[] = [];
        for (const data of itemsData) {
            items.push(
                new Item(data.itemId, data.name, data.description, data.price)
            );
        }
        return items;
    }
}
