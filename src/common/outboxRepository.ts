import Outbox from "./outbox";
import DomainEvent from "./domainEvent";

export default interface OutboxRepository {
    create(event: DomainEvent): Promise<void>;
    getByStatus(status: string[]): Promise<Outbox[]>;
    update(outboxes: Outbox[]): Promise<void>;
    delete(outboxes: Outbox[]): Promise<void>;
}
