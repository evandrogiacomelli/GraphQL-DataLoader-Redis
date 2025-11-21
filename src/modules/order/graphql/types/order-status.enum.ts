import { registerEnumType } from '@nestjs/graphql'

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus'
})