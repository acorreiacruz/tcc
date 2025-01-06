import { Controller } from "@nestjs/common";
import {
    Payload,
    Ctx,
    RmqContext,
    MessagePattern,
} from "@nestjs/microservices";
import ConfirmStock from "./application/use_case/confirmStock";
import ReserveStock from "./application/use_case/reserveStock";
import ReleaseStock from "./application/use_case/releaseStock";
import { EventDTO } from "../../common/domainEvent";
import Mediator from "apps/common/mediator";

@Controller("stock")
export class StockController {
    private mediator: Mediator;
    constructor(
        private readonly confirmStock: ConfirmStock,
        private readonly reserveStock: ReserveStock,
        private readonly releaseStock: ReleaseStock
    ) {
        this.mediator = new Mediator();
        this.mediator.register("order_confirmed", confirmStock);
        this.mediator.register("order_placed", reserveStock);
        this.mediator.register("order_canceled", releaseStock);
    }

    @MessagePattern()
    async handleOrderPlaced(
        @Payload() event: EventDTO,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            console.log(event);
            await this.mediator.dispatch(event);
            channel.ack(originalMsg);
        } catch (error) {
            console.log("Erro ao processar: ", error);
            channel.nack(originalMsg);
        }
    }
}
