import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { PlaceholderUserModel } from './placeholder-user.model'

@ObjectType('PlaceholderPost')
export class PlaceholderPostModel {
  @Field(() => ID)
  id: number

  @Field(() => Int)
  userId: number

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => PlaceholderUserModel)
  user: PlaceholderUserModel
}