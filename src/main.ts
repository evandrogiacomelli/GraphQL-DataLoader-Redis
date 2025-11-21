import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

function getPort(): number {
  const port = process.env.PORT;
  return port ? parseInt(port, 10) : DEFAULT_PORT;
}

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    const port = getPort();

    await app.listen(port);

    app.enableShutdownHooks();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
