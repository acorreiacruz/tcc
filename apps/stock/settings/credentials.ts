import * as dotenv from "dotenv";

dotenv.config({path: "./src/env/.env"})

export const STOCK_API_PORT = Number.parseInt(
    process.env.STOCK_API_PORT || "5500"
);
export const RABBITMQ_AMQP_PORT = process.env.RABBITMQ_AMQP_PORT || "invalid";
export const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME || "invalid";
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || "invalid";
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "invalid";
export const STOCK_RESERVED_EXCHANGE =
    process.env.STOCK_RESERVED_EXCHANGE || "invalid";
export const STOCK_RESERVED_ROUTING_KEY =
    process.env.STOCK_RESERVED_ROUTING_KEY || "invalid";
export const STOCK_RELEASED_EXCHANGE =
    process.env.STOCK_RELEASED_EXCHANGE || "invalid";
export const STOCK_RELEASED_ROUTING_KEY =
    process.env.STOCK_RELEASED_ROUTING_KEY || "invalid";
export const STOCK_CONFIRMED_EXCHANGE =
    process.env.STOCK_CONFIRMED_EXCHANGE || "invalid";
export const STOCK_CONFIRMED_ROUTING_KEY =
    process.env.STOCK_CONFIRMED_ROUTING_KEY || "invalid";
export const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_AMQP_PORT}`;
