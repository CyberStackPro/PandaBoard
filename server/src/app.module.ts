import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { DocumentsModule } from './documents/documents.module';
import { WorkspaceModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    WorkspaceModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
