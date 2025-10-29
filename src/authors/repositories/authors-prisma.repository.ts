import { IAuthorsRepository, SearchParams, SearchResult, } from '@/authors/interfaces/authors.repository'
import { Author } from '../graphql/models/author'
import { ICreateAuthor } from '../interfaces/create-author'
import { PrismaService } from '@/database/prisma/prisma.service'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { Prisma } from '@prisma/client'

export class AuthorsPrismaRepository implements IAuthorsRepository {

  sortableFields: string[] = ['name', 'email', 'createdAt']

  constructor(private prisma: PrismaService) {}

  async create(data: ICreateAuthor): Promise<Author> {
    return await this.prisma.author.create({ data })
  }

  update(author: Author): Promise<Author> {
    throw new Error('Method not implemented.')
  }

  delete(id: String): Promise<Author> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Author> {
    return await this.get(id);
  }

  findByEmail(email: string): Promise<Author> {
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
    const authors = await this.prisma.author.findMany({
      where,
      orderBy: { [orderByField]: orderByDir },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      items: authors,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(total / perPage),
      total,
    };
  }

  async get(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique( {
      where: { id }
    })
    if (!author) {
      throw new NotFoundError(`Author with id ${id} not found`)
    }
    return author
  }

}
