import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BlocksModule } from 'src/blocks/blocks.module';
// import { BlocksService } from 'src/blocks/blocks.service';

@Module({
  imports: [DatabaseModule, BlocksModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
