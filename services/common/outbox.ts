export default interface Outbox {
    id: string;
    eventId: string;
    eventName: string;
    status: string;
    event: string;
}
