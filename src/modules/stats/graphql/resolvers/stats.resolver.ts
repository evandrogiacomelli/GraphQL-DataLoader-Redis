import { Resolver, Query, Args } from '@nestjs/graphql'
import { UserStatsModel } from '../models/user-stats.model'
import { UserStatsLoader } from '@/modules/stats/loaders/user-stats.loader'

@Resolver(() => UserStatsModel)
export class StatsResolver {
  constructor(private userStatsLoader: UserStatsLoader) {}

  @Query(() => UserStatsModel)
  async userStats(@Args('userId') userId: string) {
    return this.userStatsLoader.load(userId)
  }
}