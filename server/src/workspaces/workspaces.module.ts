import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesGateway } from './workspaces.getway';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspacesGateway],
})
export class WorkspaceModule {}
