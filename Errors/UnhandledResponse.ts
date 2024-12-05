export class NotFoundApi extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundApi";
    }
}