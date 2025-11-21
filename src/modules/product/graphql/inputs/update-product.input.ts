import { InputType, Field, Float, Int } from '@nestjs/graphql'

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  price?: number

  @Field(() => Int, { nullable: true })
  stock?: number

  @Field({ nullable: true })
  sku?: string
}