import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/exception.filter';
import { RedisIoAdapter } from './modules/websocket/redis-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(config));

  if (process.env.NODE_ENV === 'production') {
    app.useWebSocketAdapter(new RedisIoAdapter(app, config));
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
