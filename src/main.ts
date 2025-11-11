import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://work-n-life-front-eo9f3yyvp-modioufs-projects.vercel.app',
      'http://localhost:8080', 
    ], // ou le port de ton front React
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
