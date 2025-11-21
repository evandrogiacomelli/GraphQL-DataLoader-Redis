import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './graphql/resolvers/product.resolver';
import { ProductLoader } from './loaders/product-loader';
import { ProductRatingStatsLoader } from './loaders/product-rating-stats-loader';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { UserModule } from '@/modules/user/user.module';
import { KeycloakModule } from '@/infrastructure/auth/keycloak.module';

@Module({
  imports: [DatabaseModule, CacheModule, UserModule, KeycloakModule],
  providers: [ProductService, ProductResolver, ProductLoader, ProductRatingStatsLoader],
  exports: [ProductService, ProductLoader],
})
export class ProductModule {}