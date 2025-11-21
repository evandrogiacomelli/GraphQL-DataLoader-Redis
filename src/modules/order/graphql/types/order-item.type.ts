import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql'
import { ProductType } from '@/modules/product/graphql/types/product.type'

@ObjectType()
export class OrderItemType {
  @Field(() => ID)
  id: string

  @Field()
  orderId: string

  @Field(() => ProductType, { nullable: true })
  product?: ProductType

  @Field()
  productId: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  priceAtTime: any

  @Field()
  createdAt: Date
}