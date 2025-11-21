import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class CreateOrderItemInput {
  @Field()
  productId: string

  @Field(() => Int)
  quantity: number
}