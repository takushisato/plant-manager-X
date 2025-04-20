import {
  BadRequestException,
  ClientException,
  ConflictException,
  NotFoundException,
  ServerException,
  UnauthorizedException,
} from "@/domain/common/api-exceptions";

export function processErrorResponse(status: number, message: string) {
  if (status === 401) {
    throw new UnauthorizedException(status, message);
  } else if (status === 400) {
    throw new BadRequestException(status, message);
  } else if (status === 404) {
    throw new NotFoundException(status, message);
  } else if (status === 409) {
    throw new ConflictException(status, message);
  } else if (status >= 402 && status < 500) {
    throw new ClientException(status, message);
  } else if (status >= 500) {
    throw new ServerException(status, message);
  }
}
