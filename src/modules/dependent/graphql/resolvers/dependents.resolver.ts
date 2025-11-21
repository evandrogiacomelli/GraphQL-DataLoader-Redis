import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Dependents } from '@/modules/dependent/graphql/models/dependents';

@Resolver(() => Dependents)
export class DependentsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Dependents])
  dependents() {
    return this.prisma.dependent.findMany();
  }
}
