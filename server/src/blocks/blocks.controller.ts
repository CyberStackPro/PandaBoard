// blocks/blocks.controller.ts
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
import { BlocksService } from './blocks.service';
import {
  CreateBlockDto,
  CreateBlockSchema,
  UpdateBlockDto,
  UpdateBlockSchema,
} from './dto/block.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  createBlock(
    @Body(new ZodValidationPipe(CreateBlockSchema))
    block: CreateBlockDto,
  ) {
    return this.blocksService.createBlock(block);
  }

  @Post('bulk')
  createManyBlocks(
    @Body(new ZodValidationPipe(z.array(CreateBlockSchema)))
    blocks: CreateBlockDto[],
  ) {
    return this.blocksService.createManyBlocks(blocks);
  }

  @Get('document/:documentId')
  findBlocksByDocument(
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
  ) {
    return this.blocksService.findBlocksByDocument(documentId);
  }

  @Patch(':id')
  updateBlock(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(UpdateBlockSchema))
    block: UpdateBlockDto,
  ) {
    return this.blocksService.updateBlock(id, block);
  }

  @Delete(':id')
  deleteBlock(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.blocksService.deleteBlock(id);
  }

  @Delete('document/:documentId')
  deleteBlocksByDocument(
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
  ) {
    return this.blocksService.deleteBlocksByDocument(documentId);
  }
}
