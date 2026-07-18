import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { json, urlencoded } from 'express';
import './config/firebase/firebase.provider';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  console.log('🔹 Starting Identity Service...');
  
  // Set up security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `'unsafe-inline'`, `https:`],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Configure CORS securely
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));
  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Optional: Global Prefix for versioning
  app.setGlobalPrefix('api/v1');

  // Swagger Setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Identity Service running at http://localhost:${port}`);
  console.log(`📄 Swagger Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
