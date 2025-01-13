import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { and, eq, isNull } from 'drizzle-orm';

@Injectable()
export class TrashServices {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async moveToTrash(workspaceId: string, userId) {
    const now = new Date();
    return this.database
      .update(schema.workspaces)
      .set({
        status: 'trashed',
        deleted_at: now,
        deleted_by: userId,
      })
      .where(eq(schema.workspaces.id, workspaceId))
      .returning();
  }

  async restoreWorkspace(workspaceId: string) {
    const now = new Date();
    return this.database
      .update(schema.workspaces)
      .set({
        status: 'active',
        restored_at: now,
        deleted_at: null,
        deleted_by: null,
      })
      .where(eq(schema.workspaces.id, workspaceId))
      .returning();
  }

  async permanentDelete(workspaceId: string) {
    const now = new Date();
    return this.database
      .update(schema.workspaces)
      .set({
        permanent_deleted_at: now,
        status: 'deleted',
      })
      .where(eq(schema.workspaces.id, workspaceId))
      .returning();
  }

  async getTrashedWorkspaceItems(userId: string) {
    return this.database.query.workspaces.findMany({
      where: and(
        eq(schema.workspaces.owner_id, userId),
        eq(schema.workspaces.status, 'trashed'),
        isNull(schema.workspaces.permanent_delete_at),
      ),
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        deletedBy: {
          columns: { id: true, name: true, email: true },
        },
      },
      orderBy: (workspaces, { desc }) => [desc(workspaces.deleted_at)],
    });
  }
}
