import { ObjectType, Field, Float, Int } from '@nestjs/graphql'

@ObjectType()
export class ProductRatingStatsType {
  @Field()
  productId: string

  @Field(() => Float)
  averageRating: number

  @Field(() => Int)
  totalReviews: number
}