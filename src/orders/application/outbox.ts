export default interface Outbox {
    id: string;
    eventId: string;
    eventName: string;
    entityId: string;
    status: "pending" | "published" | "failed";
    payload: string;
}
