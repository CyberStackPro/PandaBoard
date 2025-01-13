import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  CreateWorkspaceDto,
  CreateWorkspaceSchema,
  UpdateWorkspaceDto,
} from './dto/create-workspace.dto';
import {
  DuplicateWorkspaceDto,
  DuplicateWorkspaceSchema,
} from './dto/duplicate-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes()
  createWorkspace(
    @Body(new ZodValidationPipe(CreateWorkspaceSchema))
    workspaces: CreateWorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(workspaces);
  }
  @Get('owner/:ownerId')
  findAllWorkspaces(@Param('ownerId', new ParseUUIDPipe()) ownerId: string) {
    return this.workspaceService.findAllWorkspaces(ownerId);
  }

  @Get(':id')
  findWorkspaceById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workspaceService.findWorkspaceById(id);
  }

  @Patch(':id')
  updateWorkspace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() workspace: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, workspace);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteWorkspace(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }

  @Post(':id/duplicate')
  duplicateWorkspace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(DuplicateWorkspaceSchema))
    duplicateData: DuplicateWorkspaceDto,
  ) {
    return this.workspaceService.duplicateWorkspace(id, duplicateData);
  }
}
