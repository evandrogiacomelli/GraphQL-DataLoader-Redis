import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('UserStats')
export class UserStatsModel {
  @Field()
  userId: string

  @Field(() => Int)
  totalPosts: number

  @Field(() => Int)
  totalDependents: number

  @Field(() => Int)
  processingTime: number

  @Field()
  calculatedAt: Date
}