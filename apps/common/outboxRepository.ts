import Outbox from "./outbox";
import { DomainEvent } from "./domainEvent";

export default interface OutboxRepository {
    create(event: DomainEvent): Promise<void>;
    getByStatus(status: string[]): Promise<Outbox[]>;
    updateStatus(outboxes: Outbox[]): Promise<void>;
    delete(outboxes: Outbox[]): Promise<void>;
}
