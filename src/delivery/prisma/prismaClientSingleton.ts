import * as dotenv from "dotenv";
import { PrismaClient } from "./prisma-client";

dotenv.config();

export default class PrismaClientSingleton {
    static instance: PrismaClient;
    private constructor() {}
    static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient();
        }
        return PrismaClientSingleton.instance;
    }
}
