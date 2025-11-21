import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { RelationLoader } from '@/infrastructure/loaders/core/RelationLoader'
import { OrderItem } from '@prisma/client'

@Injectable()
export class OrderItemsLoader {
  private loader: RelationLoader<OrderItem>

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {
    this.loader = new RelationLoader(cacheService, {
      fetchQuery: async (orderIds: string[]) => {
        return this.prisma.orderItem.findMany({
          where: { orderId: { in: orderIds } }
        })
      },
      groupByField: 'orderId',
      cachePrefix: 'order:items',
      ttl: 3600,
      enableLogs: true,
      enableMetrics: true
    })
  }

  async load(orderId: string): Promise<OrderItem[]> {
    return this.loader.load(orderId)
  }
}