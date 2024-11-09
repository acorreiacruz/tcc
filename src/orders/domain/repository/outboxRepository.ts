import DomainEvent from "../event/domainEvent";

export default interface OutboxRepository {
    create(event: DomainEvent): Promise<void>;
    getByStatus(status: String[]): Promise<String[]>;
}
