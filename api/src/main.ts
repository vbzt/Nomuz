import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { seedAdminAcc } from './common/utils/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('merda')
  await seedAdminAcc();

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
