import { DependentsPrismaRepository } from '@/Dependents/repositories/dependents-prisma.repository'
import { DependentsOutput } from '@/Dependents/dto/dependents-output'

export namespace Usecase {
  export type Input = {
    id: string;
  }
  export type Output = DependentsOutput;

  export class UseCase {
    constructor(private dependentsRepository: DependentsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      return await this.dependentsRepository.findById(id)
    }
  }

}
