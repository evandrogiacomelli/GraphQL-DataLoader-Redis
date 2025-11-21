import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Dependents } from '@/modules/dependent/graphql/models/dependents';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field(() => [Dependents], { nullable: true })
  dependents?: Dependents[];
}
