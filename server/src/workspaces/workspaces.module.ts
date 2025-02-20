import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesGateway } from './workspaces.getway';
import { TrashServices } from './trash.service';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [DatabaseModule, DocumentsModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspacesGateway, TrashServices],
  exports: [TrashServices, WorkspacesService],
})
export class WorkspaceModule {}
