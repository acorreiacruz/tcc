export class InvalidTransitionToFailedError extends Error {
    constructor() {
        super(
            "It only is possible to change the status from 'out_for_delivery' to 'failed'"
        );
        this.name = "InvalidTransitionToFailedError";
    }
}

export class InvalidTransitionToConcludedError extends Error {
    constructor() {
        super(
            "It only is possible to change the status from 'out_for_delivery' to 'concluded'"
        );
        this.name = "InvalidTransitionToConcludedError";
    }
}

export class InvalidTransitionToAssignedError extends Error {
    constructor() {
        super(
            "It only is possible to change the status from 'on_hold' to 'assigned'"
        );
        this.name = "InvalidTransitionToAssignedError";
    }
}

export class InvalidTransitionToOutForDeliveryError extends Error {
    constructor() {
        super(
            "It only is possible to change the status from 'assigned' to 'out_for_delivery'"
        );
        this.name = "InvalidTransitionToOutForDeliveryError";
    }
}