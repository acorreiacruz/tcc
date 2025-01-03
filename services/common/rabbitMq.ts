import MessageBroker from "./messageBroker";
import { Connection, connect, ConfirmChannel } from "amqplib";
import {
    RABBITMQ_AMQP_PORT,
    RABBITMQ_HOST,
    RABBITMQ_PASSWORD,
    RABBITMQ_USERNAME,
} from "./credentials";

export default class RabbitMQ implements MessageBroker {
    private connection?: Connection;
    private channel?: ConfirmChannel;
    private url: string;

    constructor() {
        this.url = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_AMQP_PORT}/`;
    }
    async close(): Promise<void> {
        await this.connection?.close();
    }
    async connect(): Promise<void> {
        this.connection = await connect(this.url);
        this.channel = await this.connection.createConfirmChannel();
    }

    async publish(
        message: string,
        exchange: string,
        routingKey: string
    ): Promise<string> {
        let result = "published";
        if (!this.connection || !this.channel) {
            await this.connect();
        }
        this.channel?.publish(
            exchange,
            routingKey,
            Buffer.from(message),
            { persistent: true },
            (error) => {
                if (error) {
                    result = "failed";
                }
            }
        );
        return result;
    }

    async consume(queue: string, callback: Function): Promise<void> {
        if (!this.connection || !this.channel) {
            await this.connect();
        }
        this.channel?.consume(
            queue,
            async (message) => {
                if (message) {
                    try {
                        await callback(JSON.parse(message.content.toString()));
                        this.channel?.ack(message);
                    } catch (error) {
                        throw error;
                    }
                }
            },
            { noAck: false }
        );
    }
}
