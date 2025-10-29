import { AuthorOutput } from '@/authors/dto/author-output'
import { AuthorsPrismaRepository } from '@/authors/repositories/authors-prisma.repository'
import { SearchInput } from '@/shared/dto/search-input'
import { PaginationOutput } from '@/shared/dto/pagination-output'


export namespace ListAuthorsUsecase {
  export type Input = SearchInput;
  export type Output = PaginationOutput<AuthorOutput>;

  export class UseCase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.authorsRepository.search(input);
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
