import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Dependents {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date
}
