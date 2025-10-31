import { IUsersRepository } from '@/User/interfaces/users.repository'
import { User } from '../graphql/models/user'
import { PrismaService } from '@/database/prisma/prisma.service'
import { NotFoundError } from '@/shared/errors/not-found-error'

export class UsersPrismaRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }
}
