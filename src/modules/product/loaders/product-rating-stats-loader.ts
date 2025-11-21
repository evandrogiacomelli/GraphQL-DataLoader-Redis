import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { ProcessLoader } from '@/infrastructure/loaders/core/ProcessLoader'

export interface ProductRatingStats {
  productId: string
  averageRating: number
  totalReviews: number
}

@Injectable()
export class ProductRatingStatsLoader {
  private loader: ProcessLoader<ProductRatingStats>

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {
    this.loader = new ProcessLoader(cacheService, {
      processFn: async (productIds: string[]) => {
        const reviews = await this.prisma.productReview.groupBy({
          by: ['productId'],
          where: { productId: { in: productIds } },
          _avg: { rating: true },
          _count: { id: true }
        })

        const statsMap = new Map<string, ProductRatingStats>()

        reviews.forEach(review => {
          statsMap.set(review.productId, {
            productId: review.productId,
            averageRating: review._avg.rating || 0,
            totalReviews: review._count.id
          })
        })

        productIds.forEach(id => {
          if (!statsMap.has(id)) {
            statsMap.set(id, {
              productId: id,
              averageRating: 0,
              totalReviews: 0
            })
          }
        })

        return statsMap
      },
      cachePrefix: 'product:rating:stats',
      ttl: 1800,
      enableLogs: true,
      enableMetrics: true
    })
  }

  async load(productId: string): Promise<ProductRatingStats> {
    return this.loader.load(productId)
  }
}