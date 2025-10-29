import { UsersPrismaRepository } from '@/User/repositories/users-prisma.repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import { UserOutput } from '@/User/dto/user-output'

export namespace CreateUserUsecase {

  export type Input = {
    name: string;
    email: string;
  }

  export type Output = UserOutput;

  export class UseCase {
    constructor(private usersRepository: UsersPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { email, name } = input
      if (email || !name) throw new BadRequestError('Please enter a valid email and name.')

      const emailExists = await this.usersRepository.findByEmail(email)
      if (emailExists) throw new ConflictError('Email already exists')

      return await this.usersRepository.create(input)
    }
  }

}
