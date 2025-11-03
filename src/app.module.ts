import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import path from 'node:path'
import { AppResolver } from '@/app.resolver'
import { UserModule } from '@/User/user.module';
import { DependentsModule } from '@/Dependents/dependents.module'
import { CacheModule } from '@/cache/cache.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), './src/schema.gql'),
    }),
    UserModule,
    DependentsModule,
    CacheModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
