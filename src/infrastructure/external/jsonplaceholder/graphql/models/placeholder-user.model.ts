import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('PlaceholderUser')
export class PlaceholderUserModel {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  username: string

  @Field()
  email: string

  @Field()
  phone: string

  @Field()
  website: string
}