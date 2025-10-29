import {
  IUsersRepository,
  SearchParams,
  SearchResult,
} from '@/User/interfaces/users.repository'
import { User } from '../graphql/models/user'
import { ICreateUser } from '../interfaces/create-user'
import { PrismaService } from '@/database/prisma/prisma.service'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { Prisma } from '@prisma/client'

export class UsersPrismaRepository implements IUsersRepository {

  sortableFields: string[] = ['name', 'email', 'createdAt']

  constructor(private prisma: PrismaService) {}

  async create(data: ICreateUser): Promise<User> {
    return await this.prisma.author.create({ data })
  }

  update(user: User): Promise<User> {
    throw new Error('Method not implemented.')
  }

  delete(id: String): Promise<User> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<User> {
    return await this.get(id);
  }

  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const { page = 1, perPage = 15, filter, sort, sortDir } = params;

    const isSortable = (s?: string | null | undefined) =>
      !!s && this.sortableFields.includes(s)
    const orderByField = isSortable(sort) ? sort! : 'createdAt';
    const orderByDir: 'asc' | 'desc' = sortDir ?? 'desc';

    const where: Prisma.AuthorWhereInput | undefined = filter
      ? {
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { email: { contains: filter, mode: 'insensitive' } },
        ],
      }
      : undefined;

    const total = await this.prisma.author.count({ where });
    const users = await this.prisma.author.findMany({
      where,
      orderBy: { [orderByField]: orderByDir },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      items: users,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(total / perPage),
      total,
    };
  }

  async get(id: string): Promise<User> {
    const user = await this.prisma.author.findUnique( {
      where: { id }
    })
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
    return user
  }

}
