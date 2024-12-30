import { Inject, Injectable } from '@nestjs/common';
// import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';
import * as schema from './schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { eq } from 'drizzle-orm';
import { ProjectsGateway } from './projects.getway';

@Injectable()
export class ProjectsService {
  private projectsCache: Map<string, any[]> = new Map();
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly projectsGateway: ProjectsGateway,
  ) {}
  async createProject(project: CreateProjectDto) {
    const defaultMetadata =
      project.type === 'folder' ? { childCount: 0 } : { fileType: 'document' };

    const result = await this.database
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

    // Emit the new project to all connected clients
    this.projectsGateway.emitToUser(
      project.owner_id,
      'onProjectCreated',
      result[0],
    );
    return result;
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
    const updatedProject = await this.database
      .update(schema.projects)
      .set(project)
      .where(eq(schema.projects.id, id))
      .returning();

    if (updatedProject[0]) {
      this.projectsGateway.emitToUser(
        updatedProject[0].owner_id,
        'onProjectUpdated',
        updatedProject[0],
      );
    }

    return updatedProject[0];
  }

  async deleteProject(id: string) {
    const deletedProject = await this.database
      .delete(schema.projects)
      .where(eq(schema.projects.id, id))
      .returning();

    if (deletedProject[0]) {
      this.projectsGateway.emitToUser(
        deletedProject[0].owner_id,
        'onProjectDeleted',
        { id },
      );
    }

    return deletedProject[0];
  }
  async duplicateProject(projectId: string, withContent: boolean = true) {
    const originalProject = await this.findProjectById(projectId);
    if (!originalProject) throw new Error('Project not found');

    const duplicateProjectRecursive = async (
      project: any,
      parentId: string | null = null,
    ): Promise<any> => {
      // Ensure all required fields are present
      const newProjectData: CreateProjectDto = {
        name: `${project.name} (Copy)`,
        type: project.type,
        parent_id: parentId,
        owner_id: project.owner_id,
        status: project.status || 'active',
        visibility: project.visibility || 'private',
        metadata: withContent ? project.metadata : {},
        icon: project.icon || '',
        cover_image: project.cover_image || null,
      };

      const [newProject] = await this.createProject(newProjectData);

      if (withContent && project.children?.length) {
        for (const child of project.children) {
          await duplicateProjectRecursive(child, newProject.id);
        }
      }

      return newProject;
    };

    return duplicateProjectRecursive(
      originalProject,
      originalProject.parent_id,
    );
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
