import Order from "../../domain/entity/order";
import OrderRepository from "../../domain/repository/orderRepository";
import { PrismaClient } from "@prisma/client";

export default class OrderRepositoryDatabase implements OrderRepository {
    private client: PrismaClient;
    
    constructor() {
        this.client = new PrismaClient();
    }
}
