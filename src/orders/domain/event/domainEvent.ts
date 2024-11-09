export default interface DomainEvent {
    eventId: string;
    entityId: string;
    correlationId: string;
    name: string;
    timestamp: Date;
    source: string;
    payload: Object;
}
