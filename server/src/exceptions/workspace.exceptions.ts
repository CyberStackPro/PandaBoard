// exceptions/workspace.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class WorkspaceNotFoundException extends HttpException {
  constructor(id: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Workspace Not Found',
        message: `Workspace with ID ${id} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedWorkspaceAccessException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Unauthorized Access',
        message: 'You do not have permission to access this workspace',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
