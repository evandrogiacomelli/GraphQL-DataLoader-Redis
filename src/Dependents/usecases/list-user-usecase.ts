import { UserOutput } from '@/User/dto/user-output'
import { UsersPrismaRepository } from '@/User/repositories/users-prisma.repository'
import { SearchInput } from '@/shared/dto/search-input'
import { PaginationOutput } from '@/shared/dto/pagination-output'


export namespace ListUsersUsecase {
  export type Input = SearchInput;
  export type Output = PaginationOutput<UserOutput>;

  export class UseCase {
    constructor(private usersRepository: UsersPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.usersRepository.search(input);
      return {
        items: searchResult.items,
        total: searchResult.total,
        currentPage: searchResult.currentPage,
        perPage: searchResult.perPage,
        lastPage: searchResult.lastPage,
      }
    }
  }

}
