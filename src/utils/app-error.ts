interface IBaseAppError {
    message?: string;
    status?: number;
}
export class BaseAppError implements IBaseAppError {
    message?: string;
    status?: number;
    constructor(message?: string, status?: number) {
        this.message = message;
        this.status = status;
    }
}
