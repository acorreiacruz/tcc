import Order from "../../domain/entity/order";
import DomainEvent from "../../../common/domainEvent";

export default interface OrderRepository {
    getById(orderId: string): Promise<Order>;
    create(order: Order, event: DomainEvent): Promise<void>;
    update(order: Order, event: DomainEvent): Promise<void>;
}
