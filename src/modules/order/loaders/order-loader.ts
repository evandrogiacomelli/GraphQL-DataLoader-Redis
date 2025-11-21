import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { EntityLoader } from '@/infrastructure/loaders/core/EntityLoader'
import { Order } from '@prisma/client'

@Injectable()
export class OrderLoader {
  private loader: EntityLoader<Order>

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {
    this.loader = new EntityLoader(cacheService, {
      fetchQuery: async (ids: string[]) => {
        return this.prisma.order.findMany({
          where: { id: { in: ids } }
        })
      },
      idField: 'id',
      cachePrefix: 'order',
      ttl: 3600,
      enableLogs: true,
      enableMetrics: true
    })
  }

  async load(id: string): Promise<Order | null> {
    return this.loader.load(id)
  }
}