import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { InvokeRecordInterceptor } from './common/invoke-record.interceptor';

config({
  path: `.env.development.local`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
