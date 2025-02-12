import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from './dto/create-document.dto';

import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { BlocksService } from 'src/blocks/blocks.service';
import { CreateBlockDto } from 'src/blocks/dto/block.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly blocksService: BlocksService,
    // private readonly documentsGateway: DocumentsGateway
  ) {}

  async createDocumentWithBlocks(data: {
    document: CreateDocumentDto;
    blocks: CreateBlockDto[];
  }) {
    this.logger.log('Entering createDocumentWithBlocks service:'); // Add logs
    this.logger.debug(`Type of data: ${typeof data}`);
    this.logger.debug(`Data object received: ${JSON.stringify(data, null, 2)}`);

    const insertedDocuments = await this.database
      .insert(schema.documents)
      .values(data.document)
      .returning();
    const newDocument = insertedDocuments[0];

    if (data.blocks.length > 0) {
      const blocksWithDocumentId = data.blocks.map((block) => ({
        ...block,
        document_id: newDocument.id,
      }));
      await this.blocksService.createManyBlocks(blocksWithDocumentId);
    }
    console.log(newDocument);

    return this.findDocumentById(newDocument.id);
    // return data;
  }

  async findDocumentsByProject(projectId: string) {
    return this.database.query.documents.findMany({
      where: (documents, { eq }) => eq(documents.project_id, projectId),
      with: {
        project: {
          columns: {
            id: true,
            name: true,
            owner_id: true,
            description: true,
            status: true,
          },
        },
      },
    });
  }

  async findDocumentById(id: string) {
    return this.database.query.documents.findFirst({
      where: (documents, { eq }) => eq(documents.id, id),
      with: {
        project: true,
        lastEditedBy: {
          columns: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateDocument(id: string, document: UpdateDocumentDto) {
    return this.database
      .update(schema.documents)
      .set(document)
      .where(eq(schema.documents.id, id))
      .returning();
  }

  async deleteDocument(id: string) {
    return this.database
      .delete(schema.documents)
      .where(eq(schema.documents.id, id))
      .returning();
  }
}
