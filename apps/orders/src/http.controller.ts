import { Body, Controller, HttpCode, Post, Put } from "@nestjs/common";
import PlaceOrder, {
    PlaceOrderCommand,
    PlaceOrderOutput,
} from "./application/use_case/placeOrder";
import {
    CancelOrder,
    CancelOrderCommand,
    CancelOrderOutput,
} from "./application/use_case/cancelOrder";

@Controller("orders")
export class HttpController {
    constructor(
        private readonly placeOrder: PlaceOrder,
        private readonly cancelOrder: CancelOrder
    ) {}
    @Post("place")
    @HttpCode(204)
    async place(@Body() command: PlaceOrderCommand): Promise<PlaceOrderOutput> {
        return await this.placeOrder.execute(command);
    }

    @Put(":orderId/cancel")
    @HttpCode(202)
    async cancel(
        @Body() command: CancelOrderCommand
    ): Promise<CancelOrderOutput> {
        return await this.cancelOrder.execute(command);
    }
}
