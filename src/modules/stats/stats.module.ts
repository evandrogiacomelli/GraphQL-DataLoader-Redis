import { Module } from '@nestjs/common';
import { StatsResolver } from './graphql/resolvers/stats.resolver';
import { UserStatsLoader } from './loaders/user-stats.loader';
import { DatabaseModule } from '@/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StatsResolver, UserStatsLoader],
})
export class StatsModule {}