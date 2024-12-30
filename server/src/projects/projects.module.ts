import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectsGateway } from './projects.getway';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsGateway],
})
export class ProjectsModule {}
