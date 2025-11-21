import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { EntityLoader } from '@/infrastructure/loaders/core/EntityLoader'
import { Product } from '@prisma/client'

@Injectable()
export class ProductLoader {
  private loader: EntityLoader<Product>

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {
    this.loader = new EntityLoader(cacheService, {
      fetchQuery: async (ids: string[]) => {
        return this.prisma.product.findMany({
          where: { id: { in: ids } }
        })
      },
      idField: 'id',
      cachePrefix: 'product',
      ttl: 3600,
      enableLogs: true,
      enableMetrics: true
    })
  }

  async load(id: string): Promise<Product | null> {
    return this.loader.load(id)
  }
}