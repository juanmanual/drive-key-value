import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bodyParser: false});
  await app.listen(3000);
}
bootstrap();
