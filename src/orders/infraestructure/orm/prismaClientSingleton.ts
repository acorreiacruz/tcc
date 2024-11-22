import { PrismaClient } from "./prisma/prisma-client";

export default class PrismaClientSingleton {
    private static instance: PrismaClient;
    static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient();
        }
        return PrismaClientSingleton.instance;
    }
}
