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
import { TrashServices } from './trash.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspaceService: WorkspacesService,
    private readonly trashService: TrashServices,
  ) {}

  // General methods
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

  // Specific retrieval
  @Get(':id')
  findWorkspaceById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workspaceService.findWorkspaceById(id);
  }

  @Get('trash')
  getTrashedWorkspaceItems(ownerId: string) {
    return this.trashService.getTrashedWorkspaceItems(ownerId);
  }

  @Get('favorites')
  getFavoritesWorkspace(ownerId: string) {
    return this.workspaceService.getFavoritesWorkspace(ownerId);
  }

  @Get('recent')
  getRecentWorkspaces(ownerId: string) {
    return this.workspaceService.getRecentWorkspaces(ownerId);
  }

  // Mutative actions
  @Patch(':id')
  updateWorkspace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() workspace: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, workspace);
  }

  @Post(':id/duplicate')
  duplicateWorkspace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(DuplicateWorkspaceSchema))
    duplicateData: DuplicateWorkspaceDto,
  ) {
    return this.workspaceService.duplicateWorkspace(id, duplicateData);
  }

  @Post(':id/trash')
  moveToTrash(
    @Param('id', new ParseUUIDPipe()) workspaceId: string,
    ownerId: string,
  ) {
    return this.trashService.moveToTrash(workspaceId, ownerId);
  }

  @Post(':id/restore')
  restoreWorkspaces(@Param('id', new ParseUUIDPipe()) workspaceId: string) {
    return this.trashService.restoreWorkspace(workspaceId);
  }

  @Post(':id/favorite')
  toggleFavoriteWorkspace(
    @Param('id', new ParseUUIDPipe()) workspaceId: string,
    ownerId: string,
  ) {
    return this.workspaceService.toggleFavoriteWorkspace(workspaceId, ownerId);
  }

  // Deletion
  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  permanentDelete(@Param('id', new ParseUUIDPipe()) workspaceId: string) {
    return this.trashService.permanentDelete(workspaceId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteWorkspace(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }
}
