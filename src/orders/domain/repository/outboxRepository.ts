import Outbox from "../../application/outbox";
import DomainEvent from "../event/domainEvent";

export default interface OutboxRepository {
    create(event: DomainEvent): Promise<void>;
    getByStatus(status: string[]): Promise<Outbox[]>;
    update(outboxes: Outbox[]): Promise<void>;
}
