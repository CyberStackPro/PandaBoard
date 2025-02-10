import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  // CreateDocumentDto,
  CreateDocumentSchema,
  UpdateDocumentDto,
  UpdateDocumentSchema,
} from './dto/create-document.dto';

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('create')
  createDocument(
    @Body(new ZodValidationPipe(CreateDocumentSchema))
    documents: any,
  ) {
    return this.documentsService.createDocumentWithBlocks(documents as any);
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
