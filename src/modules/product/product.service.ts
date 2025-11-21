import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { ProductLoader } from './loaders/product-loader';
import { CreateProductInput } from './graphql/inputs/create-product.input';
import { UpdateProductInput } from './graphql/inputs/update-product.input';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productLoader: ProductLoader,
  ) {}

  async create(supplierId: string, input: CreateProductInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...input,
        supplierId,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.productLoader.load(id);
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySupplierId(supplierId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, supplierId: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.supplierId !== supplierId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.product.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string, supplierId: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.supplierId !== supplierId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}