import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORRECTION CORS ---
  app.enableCors({
    origin: '*', // En production, idéalement mettre l'URL du frontend, mais '*' débloque tout pour le test
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -----------------------

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

await app.listen(process.env.PORT || 3000);
}
bootstrap();