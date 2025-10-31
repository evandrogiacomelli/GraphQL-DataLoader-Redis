import { Module } from '@nestjs/common';
import { DependentsResolver } from './graphql/resolvers/dependents.resolver';
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    DependentsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    }
  ]
})
export class DependentsModule {}
