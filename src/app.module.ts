import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import path from 'node:path';

import { DatabaseModule } from '@/infrastructure/database/database.module';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { CacheModuleMultiLayer } from '@/infrastructure/cache/cache.module.multi-layer';
import { MetricsController } from '@/infrastructure/loaders/metrics/MetricsController';
import { HealthController } from '@/infrastructure/health/health.controller';
import { JsonPlaceholderModule } from '@/infrastructure/external/jsonplaceholder/jsonplaceholder.module';

import { UserModule } from '@/modules/user/user.module';
import { DependentModule } from '@/modules/dependent/dependent.module';
import { PostModule } from '@/modules/post/post.module';
import { StatsModule } from '@/modules/stats/stats.module';
import { ProductModule } from '@/modules/product/product.module';
import { OrderModule } from '@/modules/order/order.module';

import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), './src/schema.gql'),
    }),
    UserModule,
    DependentModule,
    PostModule,
    StatsModule,
    JsonPlaceholderModule,
    ProductModule,
    OrderModule,
    CacheModule,
    CacheModuleMultiLayer,
  ],
  controllers: [MetricsController, HealthController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
