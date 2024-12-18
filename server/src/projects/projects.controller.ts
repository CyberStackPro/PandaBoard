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
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  CreateProjectSchema,
  UpdateProjectDto,
} from './dto/create-project.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes()
  createProject(
    @Body(new ZodValidationPipe(CreateProjectSchema))
    projects: CreateProjectDto,
  ) {
    return this.projectsService.createProject(projects);
  }
  @Get('owner/:ownerId')
  findAllProjects(@Param('ownerId', new ParseUUIDPipe()) ownerId: string) {
    return this.projectsService.findAllProjects(ownerId);
  }

  @Get(':id')
  findProjectById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.findProjectById(id);
  }

  @Patch(':id')
  updateProject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() project: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProject(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.deleteProject(id);
  }
}
