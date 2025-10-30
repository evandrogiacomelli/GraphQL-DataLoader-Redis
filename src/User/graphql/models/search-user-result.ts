import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from '@/User/graphql/models/user'

@ObjectType()
export class SearchUserResult {
  @Field(() => [User])
  items: User[];

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  lastPage: number

  @Field(() => Int)
  total: number
}
