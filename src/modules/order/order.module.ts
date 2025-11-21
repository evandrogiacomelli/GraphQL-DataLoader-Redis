import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver, OrderItemResolver } from './graphql/resolvers/order.resolver';
import { OrderLoader } from './loaders/order-loader';
import { OrderItemsLoader } from './loaders/order-items-loader';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { UserModule } from '@/modules/user/user.module';
import { ProductModule } from '@/modules/product/product.module';
import { KeycloakModule } from '@/infrastructure/auth/keycloak.module';

@Module({
  imports: [DatabaseModule, CacheModule, UserModule, ProductModule, KeycloakModule],
  providers: [OrderService, OrderResolver, OrderItemResolver, OrderLoader, OrderItemsLoader],
  exports: [OrderService, OrderLoader, OrderItemsLoader],
})
export class OrderModule {}