// blocks/blocks.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { CreateBlockDto, UpdateBlockDto } from './dto/block.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class BlocksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createBlock(block: CreateBlockDto) {
    return this.database.insert(schema.blocks).values(block).returning();
  }

  async createManyBlocks(blocks: any) {
    return this.database.insert(schema.blocks).values(blocks).returning();
  }

  async findBlocksByDocument(documentId: string) {
    return this.database.query.blocks.findMany({
      where: (blocks, { eq }) => eq(blocks.document_id, documentId),
      orderBy: (blocks, { asc }) => [asc(blocks.sort_order)],
      with: {
        childBlocks: {
          orderBy: (blocks, { asc }) => [asc(blocks.sort_order)],
        },
      },
    });
  }

  async updateBlock(id: string, block: UpdateBlockDto) {
    return this.database
      .update(schema.blocks)
      .set(block)
      .where(eq(schema.blocks.id, id))
      .returning();
  }

  async deleteBlock(id: string) {
    return this.database
      .delete(schema.blocks)
      .where(eq(schema.blocks.id, id))
      .returning();
  }

  async deleteBlocksByDocument(documentId: string) {
    return this.database
      .delete(schema.blocks)
      .where(eq(schema.blocks.document_id, documentId))
      .returning();
  }
}
