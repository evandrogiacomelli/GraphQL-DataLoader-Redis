import { UsersPrismaRepository } from '@/User/repositories/users-prisma.repository'
import { UserOutput } from '@/User/dto/user-output'

export namespace Usecase {
  export type Input = {
    id: string;
  }
  export type Output = UserOutput;

  export class UseCase {
    constructor(private usersRepository: UsersPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      return await this.usersRepository.findById(id)
    }
  }

}
