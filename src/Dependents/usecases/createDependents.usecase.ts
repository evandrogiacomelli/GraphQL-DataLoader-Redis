import { DependentsPrismaRepository } from '@/Dependents/repositories/dependents-prisma.repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import { DependentsOutput } from '@/Dependents/dto/dependents-output'

export namespace CreateDependentsUsecase {

  export type Input = {
    name: string;
    email: string;
    userId: string;
  }

  export type Output = DependentsOutput;

  export class UseCase {
    constructor(private dependentsRepository: DependentsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { email, name } = input
      if (email || !name) throw new BadRequestError('Please enter a valid email and name.')

      const emailExists = await this.dependentsRepository.findByEmail(email)
      if (emailExists) throw new ConflictError('Email already exists')

      return await this.dependentsRepository.create(input)
    }
  }

}
