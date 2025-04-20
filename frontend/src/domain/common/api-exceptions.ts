export class BadRequestException extends Error {
    status = 400;
    constructor(status: number, message: string) {
        super();
        this.message = `${status} Bad Request: ${message}`;
    }
}

export class UnauthorizedException extends Error {
    status = 401;
    constructor(status: number, message: string) {
        super();
        this.message = `${status} Unauthorized: ${message}`;
    }
}

export class NotFoundException extends Error {
    status = 404;
    constructor(status: number, message: string) {
        super();
        this.message = `${status} Not Found: ${message}`;
    }
}

export class ConflictException extends Error {
    status = 409;
    constructor(status: number, message: string) {
        super();
        this.message = `${status} Conflict: ${message}`;
    }
}

export class ClientException extends Error {
    status: number;
    constructor(status: number, body: string) {
        super();
        this.message = `${status} Client Error: ${body}`;
        this.message += `body`;
        this.status = status;
    }
}

export class ServerException extends Error {
    status: number;
    constructor(status: number, message: string) {
        super();
        this.message = `${status} Server Error: ${message}`;
        this.status = status;
    }
}
