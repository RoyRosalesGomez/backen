
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: normalmente solo tu frontend (3000). Puedes dejar 3002 si haces pruebas desde ahí.
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const swaggerCfg = new DocumentBuilder()
    .setTitle('AgroGlobal API')
    .setDescription('Sistema integral para el sector agrícola')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api');

  // ➜ Leer puerto desde .env (o 3002 por defecto)
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT') ?? '3002', 10);

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 AgroGlobal Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
