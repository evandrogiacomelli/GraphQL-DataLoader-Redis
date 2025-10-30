import { Query, Resolver } from '@nestjs/graphql'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Dependents } from '@/Dependents/graphql/models/dependents'

@Resolver(() => Dependents)
export class DependentsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Dependents])
  dependents() {
    return this.prisma.dependent.findMany();
  }
}
