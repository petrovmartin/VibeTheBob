import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';

async function runSeed() {
  const logger = new Logger('DatabaseSeeder');
  try {
    const { seed } = require('./infrastructure/prisma/seed/seed');
    await seed();
    logger.log('Database seeding completed');
  } catch (error) {
    logger.error('Error during database seeding:', error.message);
    // Don't throw the error - we want the application to start even if seeding fails
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable cookie parser
  app.use(cookieParser());
  
  // Configure CORS for Next.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  });

  // Run database seeding
  await runSeed();

  await app.listen(4000);
  console.log('Application is running on: http://localhost:4000');
}
bootstrap();
