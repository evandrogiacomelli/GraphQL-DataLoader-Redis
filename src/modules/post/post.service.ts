import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany()
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({ where: { id } })
  }
}