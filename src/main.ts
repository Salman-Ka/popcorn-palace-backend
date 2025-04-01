import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create a new NestJS application instance using AppModule
  const app = await NestFactory.create(AppModule);

  // Enable global validation using class-validator decorators in DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Start listening on port 3000
  await app.listen(3000);
}

// Start the application
bootstrap();
