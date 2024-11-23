import Order from "../../domain/entity/order";
import DomainEvent from "../../../common/domainEvent";
import OrderRepository from "./orderRepository";
import PrismaClientSingleton from "../orm/prismaClientSingleton";
import { PrismaClient } from "../orm/prisma/prisma-client";

export default class OrderRepositoryDatabase implements OrderRepository {
    private client: PrismaClient;

    constructor() {
        this.client = PrismaClientSingleton.getInstance();
    }

    async getById(orderId: string): Promise<Order> {
        const orderData = await this.client.order.findFirst({
            where: {
                orderId: orderId,
            },
        });
        if (!orderData)
            throw new Error(`There is no order with this id: ${orderId}`);
        return Order.restore(
            orderData.orderId,
            orderData.userId,
            orderData.orderDate,
            orderData.status,
            orderData.fulfillmentMethod,
            orderData.paymentMethod,
            orderData.total
        );
    }

    async create(order: Order, event: DomainEvent): Promise<void> {
        const orderCreation = this.client.order.create({
            data: {
                orderId: order.getId(),
                userId: order.getUserId(),
                status: order.getStatus(),
                paymentMethod: order.getPaymentMethod(),
                fulfillmentMethod: order.getFulfillmentMethod(),
                total: order.getTotal(),
                orderDate: order.getOrderDate(),
                orderItems: {
                    create: Object.assign(order.getOrderItems()),
                },
            },
        });
        const orderOutboxCreation = this.client.orderOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
        await this.client.$transaction([orderCreation, orderOutboxCreation]);
    }

    async update(order: Order, event: DomainEvent): Promise<void> {
        const orderUpdate = this.client.order.update({
            where: {
                orderId: order.getId(),
            },
            data: {
                status: order.getStatus(),
                paymentMethod: order.getPaymentMethod(),
                fulfillmentMethod: order.getFulfillmentMethod(),
                total: order.getTotal(),
            },
        });
        const orderOutboxCreation = this.client.orderOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
        await this.client.$transaction([orderUpdate, orderOutboxCreation]);
    }
}
