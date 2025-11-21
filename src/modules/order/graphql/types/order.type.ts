import { ObjectType, Field, ID, Float } from '@nestjs/graphql'
import { User } from '@/modules/user/graphql/models/user'
import { OrderItemType } from './order-item.type'
import { OrderStatus } from './order-status.enum'

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string

  @Field(() => User, { nullable: true })
  buyer?: User

  @Field()
  buyerId: string

  @Field(() => [OrderItemType], { nullable: true })
  items?: OrderItemType[]

  @Field(() => OrderStatus)
  status: OrderStatus

  @Field(() => Float)
  total: any

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}