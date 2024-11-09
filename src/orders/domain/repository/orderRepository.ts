import Order from "../entity/order";
import DomainEvent from "../event/domainEvent";

export default interface OrderRepository {
    getById(orderId: string): Promise<Order>;
    create(order: Order, event: DomainEvent): Promise<void>;
    update(order: Order, event: DomainEvent): Promise<void>;
}
