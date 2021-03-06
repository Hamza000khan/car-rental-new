import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  // creating the app module
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  // adding the cors policy
  app.enableCors();
  app.use(compression());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

  // setting the global uri prefix
  app.setGlobalPrefix('/v1/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // config for the swagger ui
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      // building the swagger and setting its parametres
      new DocumentBuilder()
        .setTitle('Car Rental Management System')
        .setDescription('API documentation for car rental management system.')
        .setVersion('0.1.0')
        .addServer('http://localhost:3000')
        .addBearerAuth()
        .build(),
      { ignoreGlobalPrefix: true },
    ),
  );
  await app.listen(3000);
}
bootstrap();
