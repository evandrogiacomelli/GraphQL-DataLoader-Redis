import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { OrderService } from '../../order.service'
import { OrderType } from '../types/order.type'
import { OrderItemType } from '../types/order-item.type'
import { CreateOrderInput } from '../inputs/create-order.input'
import { UpdateOrderStatusInput } from '../inputs/update-order-status.input'
import { KeycloakGuard } from '@/shared/guards/keycloak.guard'
import { RolesGuard } from '@/shared/guards/roles.guard'
import { Roles } from '@/shared/decorators/roles.decorator'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import type { UserContextData } from '@/shared/context/user.context'
import { User } from '@/modules/user/graphql/models/user'
import { UserService } from '@/modules/user/user.service'
import { ProductService } from '@/modules/product/product.service'
import { ProductType } from '@/modules/product/graphql/types/product.type'

@Resolver(() => OrderType)
@UseGuards(KeycloakGuard, RolesGuard)
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService
  ) {}

  @Mutation(() => OrderType)
  @Roles('BUYER')
  async createOrder(
    @CurrentUser() user: UserContextData,
    @Args('input') input: CreateOrderInput
  ): Promise<any> {
    return this.orderService.create(user.id, input)
  }

  @Query(() => OrderType, { nullable: true })
  async order(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.orderService.findById(id)
  }

  @Query(() => [OrderType])
  @Roles('BUYER')
  async myOrders(@CurrentUser() user: UserContextData): Promise<any[]> {
    return this.orderService.findByBuyerId(user.id)
  }

  @Query(() => [OrderType])
  async orders(): Promise<any[]> {
    return this.orderService.findAll()
  }

  @Mutation(() => OrderType)
  async updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateOrderStatusInput
  ): Promise<any> {
    return this.orderService.updateStatus(id, input)
  }

  @Mutation(() => OrderType)
  @Roles('BUYER')
  async cancelOrder(
    @CurrentUser() user: UserContextData,
    @Args('id', { type: () => ID }) id: string
  ): Promise<any> {
    return this.orderService.cancel(id, user.id)
  }

  @ResolveField(() => User, { nullable: true })
  async buyer(@Parent() order: OrderType): Promise<User | null> {
    return this.userService.findById(order.buyerId)
  }

  @ResolveField(() => [OrderItemType])
  async items(@Parent() order: OrderType): Promise<OrderItemType[]> {
    return this.orderService.findOrderItems(order.id)
  }
}

@Resolver(() => OrderItemType)
export class OrderItemResolver {
  constructor(private productService: ProductService) {}

  @ResolveField(() => ProductType, { nullable: true })
  async product(@Parent() orderItem: OrderItemType): Promise<ProductType | null> {
    return this.productService.findById(orderItem.productId)
  }
}