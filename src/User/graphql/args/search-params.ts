import { ArgsType, Field, Int } from '@nestjs/graphql'


@ArgsType()
export class SearchParamsArgs {

  @Field( () => Int, { nullable: true })
  page?: number;

  @Field( () => Int, { nullable: true })
  perPage?: number;

  @Field( () => String, { nullable: true })
  sort?: string;

  @Field( () => String, { nullable: true })
  sortDir?: 'asc' | 'desc'

  @Field( () => String, { nullable: true })
  filter?: string;

}
