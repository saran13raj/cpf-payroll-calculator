import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log', 'warn'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
  Logger.log(`app running on port >> ${PORT}`);
}
bootstrap();
