import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // @ts-ignore
  await app.listen(process.env.PORT);
}
bootstrap();
