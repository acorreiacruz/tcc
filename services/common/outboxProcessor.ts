export default interface OutboxProcessor {
    publishPendingOutboxes(): Promise<void>;
    clearPublishedOutboxes(): Promise<void>;
}
