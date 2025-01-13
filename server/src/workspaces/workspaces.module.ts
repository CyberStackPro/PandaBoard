import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesGateway } from './workspaces.getway';
import { TrashServices } from './trash.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspacesGateway, TrashServices],
  exports: [TrashServices],
})
export class WorkspaceModule {}
