import DomainEvent from "../../../common/domainEvent";

export class OrderDomainEventMock extends DomainEvent {
    constructor(){
        super(
            "5ef7b80e-4808-4dad-a7a1-8e93fd437fe2",
            "913fefd3-39af-4398-b989-a2a0d48d1bc2",
            "OrderEventMocked",
            new Date(),
            "OrderService",
            {
                any: "any",
            }
        );
    }
}