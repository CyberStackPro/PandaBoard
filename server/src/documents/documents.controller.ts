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
  UpdateDocumentContentDto,
  UpdateDocumentContentSchema,
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
    @Body(new ZodValidationPipe(CreateDocumentWithBlocksSchema)) // documents: {
    //   document: CreateDocumentDto;
    documents //   blocks: CreateBlockDto[];
    // },
    : {
      document: CreateDocumentDto;
      blocks: CreateBlockDto[];
    },
  ) {
    this.logger.log('Received documents in controller:'); // Add logs
    this.logger.debug(`Type of documents: ${typeof documents}`);
    this.logger.debug(
      `Documents object: ${JSON.stringify(documents, null, 2)}`,
    );

    return this.documentsService.createDocumentWithBlocks(documents);
  }

  @Get('project/:projectId')
  findDocumentsByWorkspce(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.documentsService.findDocumentsByWorkspce(projectId);
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
  // @Patch(':id') // Keep this for updating document metadata (title, status, etc.)
  // updateDocumentMetadata( // Renamed for clarity
  //     @Param('id', new ParseUUIDPipe()) id: string,
  //     @Body(new ZodValidationPipe(UpdateDocumentSchema))
  //     updateDocumentDto: UpdateDocumentDto,
  // ) {
  //     return this.documentsService.updateDocument(id, updateDocumentDto); // Keep using updateDocument for metadata updates
  // }
  @Patch(':id/content') // New endpoint for updating document content (blocks)
  updateDocumentContent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(UpdateDocumentContentSchema)) // Use new schema
    updateDocumentContentDto: UpdateDocumentContentDto, // Use new DTO
  ) {
    // this.logger.log('Received documents in controller:'); // Add logs
    // this.logger.debug(`Type of documents: ${typeof updateDocumentContentDto}`);
    // this.logger.debug(
    //   `updateDocumentContentDto object: ${JSON.stringify(updateDocumentContentDto, null, 2)}`,
    // );
    return this.documentsService.updateDocumentContent(
      id,
      updateDocumentContentDto,
    ); // Call new service function
  }

  @Delete(':id')
  deleteDocument(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.deleteDocument(id);
  }
}
