export class InvalidTransitionToAssignedError extends Error {
    constructor() {
        super(
            "It only is possible to change the status from 'on_hold' to 'assigned'"
        );
        this.name = "InvalidTransitionToAssignedError";
    }
}
