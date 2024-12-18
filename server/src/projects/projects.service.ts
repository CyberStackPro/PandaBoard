import { Inject, Injectable } from '@nestjs/common';
// import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';
import * as schema from './schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}
  async createProject(projects: CreateProjectDto) {
    return this.database.insert(schema.projects).values(projects).returning();
  }

  async findAllProjects(ownerId: string) {
    const projects = this.database.query.projects.findMany({
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        children: true,
        documents: true,
      },
      where: (projects, { eq }) => eq(projects.owner_id, ownerId),
      orderBy: (projects, { desc }) => [desc(projects.created_at)],
    });
    return projects;
  }

  async findProjectById(id: string) {
    return this.database.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        children: true,
        documents: true,
      },
    });
  }
  async updateProject(id: string, project: UpdateProjectDto) {
    const updatedProjects = this.database
      .update(schema.projects)
      .set(project)
      .where(eq(schema.projects.id, id))
      .returning();
    return updatedProjects;
  }

  async deleteProject(id: string) {
    return this.database
      .delete(schema.projects)
      .where(eq(schema.projects.id, id))
      .returning();
  }
}
