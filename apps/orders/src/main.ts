import { NestFactory } from "@nestjs/core";
import { OrdersModule } from "./orders.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(OrdersModule);
    await app.listen(3000);
}
bootstrap();
