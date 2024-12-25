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
  private projectsCache: Map<string, any[]> = new Map();
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}
  async createProject(project: CreateProjectDto) {
    const defaultMetadata =
      project.type === 'folder' ? { childCount: 0 } : { fileType: 'document' };

    return this.database
      .insert(schema.projects)
      .values({
        ...project,
        parent_id: project.parent_id || null,
        metadata: {
          ...defaultMetadata,
          ...(project.metadata || {}),
        },
      })
      .returning();
  }
  async findAllProjects(ownerId: string) {
    const allProjects = await this.database.query.projects.findMany({
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

    // Convert flat array to tree structure
    // const buildProjectTree = (
    //   projects: any[],
    //   parentId: string | null = null,
    // ): any[] => {
    //   return projects
    //     .filter((project) => project.parent_id === parentId)
    //     .map((project) => ({
    //       ...project,
    //       children: buildProjectTree(projects, project.id),
    //     }));
    // };
    const projectTree = this.buildProjectTree(allProjects);

    return projectTree;
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
  private buildProjectTree(
    projects: any[],
    parentId: string | null = null,
  ): any[] {
    return projects
      .filter((project) => project.parent_id === parentId)
      .map((project) => ({
        ...project,
        children: this.buildProjectTree(projects, project.id),
      }));
  }
}
