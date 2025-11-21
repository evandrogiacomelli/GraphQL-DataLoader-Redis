import { ObjectType, Field, Int, ID } from '@nestjs/graphql'

@ObjectType('PlaceholderComment')
export class PlaceholderCommentModel {
  @Field(() => ID)
  id: number

  @Field(() => Int)
  postId: number

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  body: string
}