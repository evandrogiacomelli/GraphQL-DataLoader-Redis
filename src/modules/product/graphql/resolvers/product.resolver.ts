import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from '../../product.service';
import { ProductType } from '../types/product.type';
import { ProductRatingStatsType } from '../types/product-rating-stats.type';
import { CreateProductInput } from '../inputs/create-product.input';
import { UpdateProductInput } from '../inputs/update-product.input';
import { KeycloakGuard } from '@/shared/guards/keycloak.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import type { UserContextData } from '@/shared/context/user.context';
import { User } from '@/modules/user/graphql/models/user';
import { UserService } from '@/modules/user/user.service';
import { ProductRatingStatsLoader } from '../../loaders/product-rating-stats-loader';

@Resolver(() => ProductType)
@UseGuards(KeycloakGuard, RolesGuard)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly productRatingStatsLoader: ProductRatingStatsLoader,
  ) {}

  @Mutation(() => ProductType)
  @Roles('SUPPLIER')
  async createProduct(
    @CurrentUser() user: UserContextData,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductType> {
    return this.productService.create(user.id, input);
  }

  @Query(() => ProductType, { nullable: true })
  async product(@Args('id', { type: () => ID }) id: string): Promise<ProductType | null> {
    return this.productService.findById(id);
  }

  @Query(() => [ProductType])
  async products(): Promise<ProductType[]> {
    return this.productService.findAll();
  }

  @Query(() => [ProductType])
  @Roles('SUPPLIER')
  async myProducts(@CurrentUser() user: UserContextData): Promise<ProductType[]> {
    return this.productService.findBySupplierId(user.id);
  }

  @Mutation(() => ProductType)
  @Roles('SUPPLIER')
  async updateProduct(
    @CurrentUser() user: UserContextData,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductType> {
    return this.productService.update(id, user.id, input);
  }

  @Mutation(() => ProductType)
  @Roles('SUPPLIER')
  async deleteProduct(
    @CurrentUser() user: UserContextData,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ProductType> {
    return this.productService.delete(id, user.id);
  }

  @ResolveField(() => User, { nullable: true })
  async supplier(@Parent() product: ProductType): Promise<User | null> {
    return this.userService.findById(product.supplierId);
  }

  @ResolveField(() => ProductRatingStatsType)
  async ratingStats(@Parent() product: ProductType): Promise<ProductRatingStatsType> {
    return this.productRatingStatsLoader.load(product.id);
  }
}