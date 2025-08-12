import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});

  console.log(crypto.randomBytes(32))
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
