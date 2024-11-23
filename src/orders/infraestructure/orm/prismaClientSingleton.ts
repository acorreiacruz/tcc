import { PrismaClient } from "./prisma/prisma-client";
import * as dotenv from "dotenv";

dotenv.config();

export default class PrismaClientSingleton {
    private static instance: PrismaClient;
    static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient();
        }
        return PrismaClientSingleton.instance;
    }
}
