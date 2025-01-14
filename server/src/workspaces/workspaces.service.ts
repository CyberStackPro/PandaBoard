import { Inject, Injectable } from '@nestjs/common';
import * as schema from './schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { WorkspacesGateway } from './workspaces.getway';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from './dto/create-workspace.dto';
import { DuplicateWorkspaceDto } from './dto/duplicate-workspace.dto';
import { TrashServices } from './trash.service';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private workspacesCache: Map<string, any[]> = new Map(),
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly workspacesGateway: WorkspacesGateway,
    private readonly trashService: TrashServices,
  ) {}
  async createWorkspace(workspace: CreateWorkspaceDto) {
    const defaultMetadata =
      workspace.type === 'folder'
        ? { childCount: 0 }
        : { fileType: 'document' };

    const result = await this.database
      .insert(schema.workspaces)
      .values({
        ...workspace,
        parent_id: workspace.parent_id || null,
        metadata: {
          ...defaultMetadata,
          ...(workspace.metadata || {}),
        },
      })
      .returning();

    // Emit the new workspace to all connected clients
    this.workspacesGateway.emitToUser(
      workspace.owner_id,
      'onWorkspaceCreated',
      result[0],
    );
    return result;
  }
  async findAllWorkspaces(ownerId: string) {
    const allWorkspaces = await this.database.query.workspaces.findMany({
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        children: true,
        documents: true,
      },
      where: (workspaces, { eq }) => eq(workspaces.owner_id, ownerId),
      orderBy: (workspaces, { desc }) => [desc(workspaces.created_at)],
    });
    const workspaceTree = this.buildWorkspaceTree(allWorkspaces);

    return workspaceTree;
  }

  async findWorkspaceById(id: string) {
    return this.database.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.id, id),
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        children: true,
        documents: true,
      },
    });
  }
  async updateWorkspace(id: string, workspace: UpdateWorkspaceDto) {
    const updatedWorkspace = await this.database
      .update(schema.workspaces)
      .set(workspace)
      .where(eq(schema.workspaces.id, id))
      .returning();

    if (updatedWorkspace[0]) {
      this.workspacesGateway.emitToUser(
        updatedWorkspace[0].owner_id,
        'onWorkspaceUpdated',
        updatedWorkspace[0],
      );
    }

    return updatedWorkspace[0];
  }

  async deleteWorkspace(id: string) {
    const deletedWorkspace = await this.database
      .delete(schema.workspaces)
      .where(eq(schema.workspaces.id, id))
      .returning();

    if (deletedWorkspace[0]) {
      this.workspacesGateway.emitToUser(
        deletedWorkspace[0].owner_id,
        'onWorkspaceDeleted',
        { id },
      );
    }

    return deletedWorkspace[0];
  }
  async duplicateWorkspace(
    workspaceId: string,
    duplicateData: DuplicateWorkspaceDto,
  ) {
    const originalWorkspace = await this.findWorkspaceById(workspaceId);
    if (!originalWorkspace) throw new Error('originalWorkspace not found');

    const duplicateWorkspaceRecursive = async (
      workspace: any,
      parentId: string | null = null,
    ): Promise<any> => {
      const newWorkspaceData: CreateWorkspaceDto = {
        name: duplicateData.name || `${workspace.name} (Copy)`,
        type: duplicateData.type || workspace.type,
        parent_id: parentId,
        owner_id: duplicateData.owner_id,
        status: duplicateData.status || workspace.status || 'active',
        visibility:
          duplicateData.visibility || workspace.visibility || 'private',
        metadata: duplicateData.withContent ? workspace.metadata || {} : {},
        icon: duplicateData.icon || workspace.icon || '',
        cover_image: duplicateData.cover_image || workspace.cover_image || null,
      };

      const newWorkspace = await this.createWorkspace(newWorkspaceData);

      if (duplicateData.withContent && workspace.children?.length) {
        for (const child of workspace.children) {
          await duplicateWorkspaceRecursive(child, newWorkspace[0].id);
        }
      }

      return newWorkspace[0];
    };

    return duplicateWorkspaceRecursive(
      originalWorkspace,
      originalWorkspace.parent_id,
    );
  }

  async toggleFavoriteWorkspace(id: string, userId: string) {
    const workspace = await this.findWorkspaceById(userId);
    return this.database
      .update(schema.workspaces)
      .set({
        favorite: !workspace?.favorite,
      })
      .where(eq(schema.workspaces.is, id))
      .returning();
  }
  async updateLastAccessesWorkspaces(id: string) {
    return this.database
      .update(schema.workspaces)
      .set({
        last_accessed_at: new Date(),
      })
      .where(eq(schema.workspaces.id, id))
      .returning();
  }
  async getFavoritesWorkspace(userId: string) {
    return this.database.query.workspaces.findMany({
      where: and(
        eq(schema.workspaces.owner_id, userId),
        eq(schema.workspaces.favorite, true),
        eq(schema.workspaces.status, 'active'),
      ),
      orderBy: (workspaces, { desc }) => [desc(workspaces.last_accessed_at)],
    });
  }
  async getRecentWorkspaces(userId: string, limit = 10) {
    return this.database.query.workspaces.findMany({
      where: and(
        eq(schema.workspaces.owner_id, userId),
        eq(schema.workspaces.status, 'active'),
      ),
      orderBy: (workspaces, { desc }) => [desc(workspaces.last_accessed_at)],
      limit,
    });
  }
  private buildWorkspaceTree(
    workspaces: any[],
    parentId: string | null = null,
  ): any[] {
    return workspaces
      .filter((workspace) => workspace.parent_id === parentId)
      .map((workspace) => ({
        ...workspace,
        children: this.buildWorkspaceTree(workspaces, workspace.id),
      }));
  }
}
