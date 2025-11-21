import { Module } from '@nestjs/common';
import { DependentsResolver } from './graphql/resolvers/dependents.resolver';
import { DatabaseModule } from '@/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DependentsResolver],
})
export class DependentModule {}
