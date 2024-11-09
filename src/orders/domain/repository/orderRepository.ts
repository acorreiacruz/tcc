import Order from "../entity/order";

export default interface OrderRepository {
    getById(orderId: string): Promise<Order>;
    create(order: Order): Promise<void>;
    update(order: Order): Promise<void>;
}
