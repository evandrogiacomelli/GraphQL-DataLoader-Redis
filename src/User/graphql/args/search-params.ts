import { ArgsType, Field, Int } from '@nestjs/graphql'


@ArgsType()
export class SearchParamsArgs {

  @Field( () => Int, { nullable: true })
  page?: number;

  @Field( () => Int, { nullable: true })
  perPage?: number;

  @Field( () => Int)
  sort?: string;

  @Field( () => Int)
  sortDir?: 'asc' | 'desc'

  @Field( () => Int)
  filter?: string;

}
