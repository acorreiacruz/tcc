import { Module } from "@nestjs/common";
import { StockController } from "./stock.controller";
import ConfirmStock from "./application/use_case/confirmStock";
import ReserveStock from "./application/use_case/reserveStock";
import ReleaseStock from "./application/use_case/releaseStock";
import StockRepositoryDataBase from "./infraestructure/repository/stockRepositoryDatabase";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { OutboxController } from "./outbox.controller";
import StockOutboxRepositoryDatabase from "./infraestructure/repository/stockOutboxRepositoryDatabase";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: "./env/.env",
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [StockController, OutboxController],
    providers: [
        PrismaService,
        ConfirmStock,
        ReserveStock,
        ReleaseStock,
        {
            provide: "StockRepository",
            useClass: StockRepositoryDataBase,
        },
        StockOutboxRepositoryDatabase
    ],
    exports: [PrismaService],
})
export class StockModule {}
