import { Query, Resolver } from '@nestjs/graphql'
import { PrismaService } from '@/database/prisma/prisma.service'
import { User } from '@/User/graphql/models/user'

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {

  }

  @Query(() => [User])
  users() {
    return this.prisma.author.findMany();
  }
}
