export abstract class DomainEvent {
    eventId: string;
    correlationId: string;
    name: string;
    timestamp: Date;
    source: string;
    payload: any;

    protected constructor(
        eventId: string,
        correlationId: string,
        name: string,
        timestamp: Date,
        source: string,
        payload: any
    ) {
        this.eventId = eventId;
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
            name: this.name,
            timestamp: this.timestamp,
            source: this.source,
            payload: this.payload,
        };
    }
}

export type EventDTO = {
    eventId: string;
    correlationId: string;
    name: string;
    timestamp: Date;
    source: string;
    payload: any;
};