import { AuthorsPrismaRepository } from '@/authors/repositories/authors-prisma.repository'
import { AuthorOutput } from '@/authors/dto/author-output'

export namespace Usecase {
  export type Input = {
    id: string;
  }
  export type Output = AuthorOutput;

  export class UseCase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      return await this.authorsRepository.findById(id)
    }
  }

}
