import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { config } from 'dotenv';
import { InvokeRecordInterceptor } from './common/invoke-record.interceptor';
import { ConfigService } from '@nestjs/config';

// config({
//   path: `.env.development.local`,
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.enableCors();
  // app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  console.log(configService.get('NEST_SERVER_PORT'));

  await app.listen(configService.get('NEST_SERVER_PORT'));
}
bootstrap();
