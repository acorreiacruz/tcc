export default abstract class DomainEvent {
    eventId: string;
    entityId: string;
    correlationId: string;
    name: string;
    timestamp: Date;
    source: string;
    payload: Object;

    protected constructor(
        eventId: string,
        entityId: string,
        correlationId: string,
        name: string,
        timestamp: Date,
        source: string,
        payload: Object
    ) {
        this.eventId = eventId;
        this.entityId = entityId;
        this.correlationId = correlationId;
        this.name = name;
        this.source = source;
        this.payload = payload;
        this.timestamp = timestamp;
    }

    toJSON(): any {
        return {
            eventId: this.eventId,
            correlationId: this.correlationId,
            entityId: this.entityId,
            name: this.name,
            timestamp: this.timestamp,
            source: this.source,
            payload: this.payload,
        };
    }
}
