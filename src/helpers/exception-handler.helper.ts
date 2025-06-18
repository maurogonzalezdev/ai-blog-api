import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from 'generated/prisma/runtime/library';

export const exceptionHandler = (error: unknown): never => {
  // ! Prisma Errors
  // ? Database connection error
  if (error instanceof PrismaClientInitializationError) {
    throw new HttpException(
      'Database service unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // ? Duplicate violation
        const field = error.meta?.target as string[];
        throw new HttpException(
          `Duplicate entry for ${field?.join(', ')}`,
          HttpStatus.CONFLICT,
        );

      case 'P2025': // ? Record not found
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);

      case 'P2003': // ? Invalid relation
        throw new HttpException('Invalid relation', HttpStatus.BAD_REQUEST);

      case 'P2023': // ? Invalid format
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          `Database error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  // ? Validation error
  if (error instanceof PrismaClientValidationError) {
    throw new BadRequestException('Invalid data format');
  }

  // ? Doom errors
  if (error instanceof PrismaClientRustPanicError) {
    throw new InternalServerErrorException('Critical database error');
  }

  // ! Nest Exceptions
  if (error instanceof NotFoundException) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  }

  if (error instanceof ForbiddenException) {
    throw new HttpException(error.initMessage, HttpStatus.FORBIDDEN);
  }

  if (error instanceof RequestTimeoutException) {
    throw new HttpException(error.initMessage, HttpStatus.REQUEST_TIMEOUT);
  }

  if (error instanceof ConflictException) {
    throw new HttpException(error.initMessage, HttpStatus.CONFLICT);
  }

  if (error instanceof UnauthorizedException) {
    throw new HttpException(error.initMessage, HttpStatus.UNAUTHORIZED);
  }

  if (error instanceof BadRequestException) {
    throw new HttpException(error.initMessage, HttpStatus.BAD_REQUEST);
  }

  if (error instanceof ServiceUnavailableException) {
    throw new HttpException(error.initMessage, HttpStatus.SERVICE_UNAVAILABLE);
  }

  throw new HttpException(
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
