import { Module } from "@nestjs/common";
import { HttpController } from "./http.controller";
import OrderRepositoryDatabase from "./infraestructure/repository/orderRepositoryDatabase";
import ItemRepositoryDatabase from "./infraestructure/repository/itemRepositoryDatabase";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import OrderOutboxRepositoryDatabase from "./infraestructure/repository/orderOutboxRepositoryDatabase";
import { CancelOrder } from "./application/use_case/cancelOrder";
import PlaceOrder from "./application/use_case/placeOrder";
import { OutboxController } from "./outbox.controller";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: "./env/.env",
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [HttpController, OutboxController],
    providers: [
        CancelOrder,
        PlaceOrder,
        {
            provide: "OrderRepository",
            useClass: OrderRepositoryDatabase,
        },
        {
            provide: "ItemRepository",
            useClass: ItemRepositoryDatabase,
        },
        PrismaService,
        OrderOutboxRepositoryDatabase,
    ],
    exports: [PrismaService],
})
export class OrdersModule {}
