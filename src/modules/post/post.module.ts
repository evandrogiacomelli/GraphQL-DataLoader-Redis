import { Module } from '@nestjs/common';
import { PostResolver } from './graphql/resolvers/post.resolver';
import { PostService } from './post.service';
import { AuthorLoader } from './loaders/author.loader';
import { DatabaseModule } from '@/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PostService, PostResolver, AuthorLoader],
  exports: [PostService],
})
export class PostModule {}