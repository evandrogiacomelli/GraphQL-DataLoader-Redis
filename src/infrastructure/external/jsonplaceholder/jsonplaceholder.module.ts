import { Module } from '@nestjs/common'
import { PlaceholderResolver } from './graphql/resolvers/placeholder.resolver'
import { PlaceholderPostLoader } from './loaders/placeholder-post.loader'
import { PlaceholderUserLoader } from './loaders/placeholder-user.loader'
import { PlaceholderCommentLoader } from './loaders/placeholder-comment.loader'

@Module({
  providers: [
    PlaceholderResolver,
    PlaceholderPostLoader,
    PlaceholderUserLoader,
    PlaceholderCommentLoader
  ],
})
export class JsonPlaceholderModule {}