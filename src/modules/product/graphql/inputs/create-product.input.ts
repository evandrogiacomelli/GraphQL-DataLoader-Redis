import { InputType, Field, Float, Int } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field(() => Float)
  price: number

  @Field(() => Int)
  stock: number

  @Field()
  sku: string
}