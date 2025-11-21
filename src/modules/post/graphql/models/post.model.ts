import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from '@/modules/user/graphql/models/user'

@ObjectType('Post')
export class PostModel {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  content: string

  @Field()
  authorId: string

  @Field(() => User)
  author: User

  @Field()
  createdAt: Date
}