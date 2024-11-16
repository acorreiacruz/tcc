export default interface MessageBroker {
    connect(): Promise<void>;
    publish(
        message: string,
        exchange: string,
        routingKey: string
    ): Promise<string>;
    consume(queue: string, callback: Function): Promise<void>;
    close(): Promise<void>;
}
