import * as dotenv from "dotenv";

dotenv.config();

export const RABBITMQ_AMQP_PORT = process.env.RABBITMQ_AMQP_PORT || "invalid";
export const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME || "invalid";
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || "invalid";
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "invalid";

export const ORDER_PLACED_EXCHANGE = process.env.ORDER_PLACED_EXCHANGE || "invalid";
export const ORDER_PLACED_ROUTING_KEY = process.env.ORDER_PLACED_ROUTING_KEY || "invalid";
export const ORDER_CANCELED_EXCHANGE = process.env.ORDER_PLACED_EXCHANGE || "invalid";
export const ORDER_CANCELED_ROUTING_KEY = process.env.ORDER_PLACED_ROUTING_KEY || "invalid";
export const ORDER_UPDATED_EXCHANGE = process.env.ORDER_PLACED_EXCHANGE || "invalid";
export const ORDER_UPDATED_ROUTING_KEY = process.env.ORDER_PLACED_ROUTING_KEY || "invalid";

