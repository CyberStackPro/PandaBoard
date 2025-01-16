import { HttpException, HttpStatus } from '@nestjs/common';

// exceptions/common.exceptions.ts
export class ValidationException extends HttpException {
  constructor(errors: any) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Validation Error',
        details: errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DatabaseException extends HttpException {
  constructor(operation: string) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Database Error',
        message: `Database operation failed: ${operation}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, id: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `${resource} with ID ${id} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
