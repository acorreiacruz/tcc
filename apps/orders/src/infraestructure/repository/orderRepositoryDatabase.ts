import Order from "../../domain/entity/order";
import DomainEvent from "../../../../../services/common/domainEvent";
import OrderRepository from "./orderRepository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export default class OrderRepositoryDatabase implements OrderRepository {

    constructor(private readonly prismaService: PrismaService) {
    }

    async getById(orderId: string): Promise<Order> {
        const orderData = await this.prismaService.order.findFirst({
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
        const orderCreation = this.prismaService.order.create({
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
        const orderOutboxCreation = this.prismaService.orderOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
        await this.prismaService.$transaction([orderCreation, orderOutboxCreation]);
    }

    async update(order: Order, event: DomainEvent): Promise<void> {
        const orderUpdate = this.prismaService.order.update({
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
        const orderOutboxCreation = this.prismaService.orderOutbox.create({
            data: {
                eventId: event.eventId,
                eventName: event.name,
                status: "pending",
                event: JSON.stringify(event),
            },
        });
        await this.prismaService.$transaction([orderUpdate, orderOutboxCreation]);
    }
}
