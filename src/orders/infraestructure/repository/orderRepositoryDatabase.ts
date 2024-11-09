import Order from "../../domain/entity/order";
import DomainEvent from "../../domain/event/domainEvent";
import OrderRepository from "../../domain/repository/orderRepository";
import { PrismaClient } from "@prisma/client";

export default class OrderRepositoryDatabase implements OrderRepository {
    private client: PrismaClient;

    constructor() {
        this.client = new PrismaClient();
    }

    async getById(orderId: string): Promise<Order> {
        const orderData = await this.client.order.findUnique({
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
        await this.client.order.create({
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
                orderOutbox: {
                    create: {
                        eventId: event.eventId,
                        eventName: event.name,
                        status: "pending",
                        payload: JSON.stringify(event),
                    },
                },
            },
        });
    }

    async update(order: Order, event: DomainEvent): Promise<void> {
        const orderData = await this.client.order.update({
            where: {
                orderId: order.getId(),
            },
            data: {
                status: order.getStatus(),
                paymentMethod: order.getPaymentMethod(),
                fulfillmentMethod: order.getFulfillmentMethod(),
                total: order.getTotal(),
                orderOutbox: {
                    create: {
                        eventId: event.eventId,
                        eventName: event.name,
                        status: "pending",
                        payload: JSON.stringify(event),
                    },
                },
            },
        });
        if (!orderData)
            throw new Error(`There is no order with this id: ${order.getId()}`);
    }
}
