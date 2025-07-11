import { ItemRepository, ItemsNotFoundError } from "./itemRepository";
import Item from "../../domain/entity/item";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export default class ItemRepositoryDatabase implements ItemRepository {
    constructor(private readonly prismaService: PrismaService) {}
    async create(item: Item): Promise<void> {
        await this.prismaService.item.create({
            data: item.toJSON(),
        });
    }
    async getByIds(itemIds: string[]): Promise<Item[]> {
        const itemsData = await this.prismaService.item.findMany({
            where: {
                itemId: { in: itemIds },
            },
        });
        if (!itemsData || itemIds.length != itemsData.length)
            throw new ItemsNotFoundError();
        const items: Item[] = [];
        for (const data of itemsData) {
            items.push(
                new Item(data.itemId, data.name, data.description, data.price)
            );
        }
        return items;
    }
}
