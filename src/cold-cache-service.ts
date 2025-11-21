import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './infrastructure/database/prisma/prisma.service'
import { CacheService } from './infrastructure/cache/cache.service'

async function bootstrap() {
  console.log('[Cold Cache Service] Starting...')

  const app = await NestFactory.createApplicationContext(AppModule)
  const prisma = app.get(PrismaService)
  const cache = app.get(CacheService)

  async function warmUpCache() {
    console.log('[Cold Cache Service] Warming up cache...')

    try {
      // Warm up products
      const products = await prisma.product.findMany({ take: 100 })
      for (const product of products) {
        await cache.set(`product:${product.id}`, JSON.stringify(product), 3600)
      }
      console.log(`[Cold Cache Service] Cached ${products.length} products`)

      // Warm up orders
      const orders = await prisma.order.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
      for (const order of orders) {
        await cache.set(`order:${order.id}`, JSON.stringify(order), 3600)
      }
      console.log(`[Cold Cache Service] Cached ${orders.length} orders`)

      // Warm up product rating stats
      const reviews = await prisma.productReview.groupBy({
        by: ['productId'],
        _avg: { rating: true },
        _count: { id: true }
      })
      for (const review of reviews) {
        const stats = {
          productId: review.productId,
          averageRating: review._avg.rating || 0,
          totalReviews: review._count.id
        }
        await cache.set(`product:rating:stats:${review.productId}`, JSON.stringify(stats), 1800)
      }
      console.log(`[Cold Cache Service] Cached rating stats for ${reviews.length} products`)

      console.log('[Cold Cache Service] Cache warm-up complete')
    } catch (error) {
      console.error('[Cold Cache Service] Error warming up cache:', error)
    }
  }

  // Initial warm-up
  await warmUpCache()

  // Schedule warm-up every 10 minutes
  setInterval(async () => {
    await warmUpCache()
  }, 10 * 60 * 1000)

  console.log('[Cold Cache Service] Running. Cache will refresh every 10 minutes.')
}

bootstrap()