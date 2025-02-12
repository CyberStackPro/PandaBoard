import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  // CreateDocumentDto,
  CreateDocumentSchema,
  CreateDocumentWithBlocksDto,
  CreateDocumentWithBlocksSchema,
  UpdateDocumentDto,
  UpdateDocumentSchema,
} from './dto/create-document.dto';

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateBlockDto } from 'src/blocks/dto/block.dto';

@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('create')
  createDocument(
    @Body(new ZodValidationPipe(CreateDocumentWithBlocksSchema))
    documents // documents: {
    //   document: CreateDocumentDto;
    //   blocks: CreateBlockDto[];
    // },
    : CreateDocumentWithBlocksDto,
  ) {
    this.logger.log('Received documents in controller:'); // Add logs
    this.logger.debug(`Type of documents: ${typeof documents}`);
    this.logger.debug(
      `Documents object: ${JSON.stringify(documents, null, 2)}`,
    );

    return this.documentsService.createDocumentWithBlocks(documents);
  }

  @Get('project/:projectId')
  findDocumentsByProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.documentsService.findDocumentsByProject(projectId);
  }

  @Get(':id/blocks')
  findDocumentById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.findDocumentById(id);
  }

  @Patch(':id')
  updateDocument(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(UpdateDocumentSchema))
    updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(id, updateDocumentDto);
  }

  @Delete(':id')
  deleteDocument(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.deleteDocument(id);
  }
}
