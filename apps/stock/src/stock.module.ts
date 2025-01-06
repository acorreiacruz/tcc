import { Module } from "@nestjs/common";
import { StockController } from "./stock.controller";
import ConfirmStock from "./application/use_case/confirmStock";
import ReserveStock from "./application/use_case/reserveStock";
import ReleaseStock from "./application/use_case/releaseStock";
import StockRepositoryDataBase from "./infraestructure/repository/stockRepositoryDatabase";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: "./env/.env",
            isGlobal: true,
        }),
    ],
    controllers: [StockController],
    providers: [
        PrismaService,
        ConfirmStock,
        ReserveStock,
        ReleaseStock,
        {
            provide: "StockRepository",
            useClass: StockRepositoryDataBase,
        },
    ],
    exports: [PrismaService],
})
export class StockModule {}
