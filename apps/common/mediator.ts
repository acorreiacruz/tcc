import { EventDTO } from "./domainEvent";

export default class Mediator {
    private handlers: Map<string, any>;

    constructor() {
        this.handlers = new Map();
    }

    register(eventName: string, handler: any): void {
        this.handlers.set(eventName, handler);
    }

    async dispatch(event: EventDTO): Promise<void> {
        const handler = this.handlers.get(event.name);
        if (!handler) {
            throw new HandlerNotFoundErorr();
        }
        return handler.execute(event);
    }
}

class HandlerNotFoundErorr extends Error {
    constructor() {
        super("Handler not founded");
        this.name = "HandlerNotFoundErorr";
    }
}
