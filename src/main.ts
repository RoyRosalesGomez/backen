// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // 💡 SIN middleware manual de OPTIONS
  app.enableCors({
    // permite localhost y cualquier *.vercel.app de tu proyecto
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'https://front-topaz-two.vercel.app',
      // si quieres permitir previews:
      /\.vercel\.app$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    credentials: false,       // déjalo en false si no usas cookies
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
  console.log('🚀 Backend listo');
}
bootstrap();
