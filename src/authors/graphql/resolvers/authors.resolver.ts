import { Query, Resolver } from '@nestjs/graphql'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Author } from '@/authors/graphql/models/author'

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private prisma: PrismaService) {

  }

  @Query(() => [Author])
  authors() {
    return this.prisma.author.findMany();
  }
}
