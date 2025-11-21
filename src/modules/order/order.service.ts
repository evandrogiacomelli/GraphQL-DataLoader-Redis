import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { OrderLoader } from './loaders/order-loader';
import { OrderItemsLoader } from './loaders/order-items-loader';
import { CreateOrderInput } from './graphql/inputs/create-order.input';
import { UpdateOrderStatusInput } from './graphql/inputs/update-order-status.input';
import { Order, OrderItem, Prisma } from '@prisma/client';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderLoader: OrderLoader,
    private readonly orderItemsLoader: OrderItemsLoader,
  ) {}

  async create(buyerId: string, input: CreateOrderInput): Promise<Order> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: input.items.map(item => item.productId) } },
    });

    const productMap = new Map(products.map(p => [p.id, p]));
    let total = new Prisma.Decimal(0);

    input.items.forEach(item => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      total = total.plus(product.price.mul(item.quantity));
    });

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId,
          status: PrismaOrderStatus.PENDING,
          total,
          items: {
            create: input.items.map(item => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: product.price,
              };
            }),
          },
        },
      });

      for (const item of input.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderLoader.load(id);
  }

  async findByBuyerId(buyerId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderItemsLoader.load(orderId);
  }

  async updateStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: input.status as PrismaOrderStatus },
    });
  }

  async cancel(id: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.buyerId !== userId) {
      throw new Error('Unauthorized');
    }

    if (order.status !== PrismaOrderStatus.PENDING) {
      throw new Error('Only pending orders can be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: PrismaOrderStatus.CANCELLED },
      });
    });
  }
}