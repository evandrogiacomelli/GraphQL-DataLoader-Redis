import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql'
import { User } from '@/modules/user/graphql/models/user'
import { ProductRatingStatsType } from './product-rating-stats.type'

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => Float)
  price: any

  @Field(() => Int)
  stock: number

  @Field()
  sku: string

  @Field(() => User, { nullable: true })
  supplier?: User

  @Field()
  supplierId: string

  @Field(() => ProductRatingStatsType, { nullable: true })
  ratingStats?: ProductRatingStatsType

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}