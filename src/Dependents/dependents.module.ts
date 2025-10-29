import { Module } from '@nestjs/common';
import { DependentsResolver } from './graphql/resolvers/dependents.resolver';
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { DependentsPrismaRepository } from '@/Dependents/repositories/dependents-prisma.repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    DependentsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'dependentsRepository',
      useFactory: (prisma: PrismaService) => {
        return new DependentsPrismaRepository(prisma);
      },
      inject: ['PrismaService'],
    }
  ]
})
export class DependentsModule {}
