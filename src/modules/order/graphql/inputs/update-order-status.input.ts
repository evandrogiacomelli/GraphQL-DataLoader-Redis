import { InputType, Field } from '@nestjs/graphql'
import { OrderStatus } from '../types/order-status.enum'

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => OrderStatus)
  status: OrderStatus
}