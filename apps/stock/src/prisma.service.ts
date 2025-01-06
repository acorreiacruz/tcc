import {
    Injectable,
    OnModuleDestroy,
    OnApplicationShutdown,
} from "@nestjs/common";
import { PrismaClient } from "./infraestructure/orm/prisma/prisma-client";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnApplicationShutdown {
    constructor() {
        super();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
    
    async onApplicationShutdown() {
        await this.$disconnect();
    }
}
