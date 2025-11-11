// main.ts - VERSIÓN DEFINITIVA CORS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    // Do not enable default cors here; we'll configure it explicitly below
  });

  // Lista de orígenes permitidos (ajusta según tus frontends)
  const allowedOrigins: Array<string | RegExp> = [
    'https://front-topaz-two.vercel.app',
    /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/,
    /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173|4200|8080)$/,
  ];

  // Habilitar CORS con función de validación para soportar credentials correctamente
  app.enableCors({
    origin: (origin, callback) => {
      // origin === undefined for non-browser requests (curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin),
      );

      if (isAllowed) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    // keep Vary header handling to let caches know responses vary by Origin
    preflightContinue: false,
  });

  // ⚡⚡⚡ PASO 3: Ahora sí configurar NestJS
  app.setGlobalPrefix('api');

  // Archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS de NestJS (redundante pero no hace daño)
  app.enableCors({
    origin: true, // Permitir todo (el middleware ya valida)
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Iniciar servidor
  const port = process.env.PORT ?? 3002;
  await app.listen(port, '0.0.0.0');

  console.log('\n' + '═'.repeat(60));
  console.log(`🚀 Backend corriendo en puerto ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS configurado para:`);
  console.log(`   - https://front-topaz-two.vercel.app`);
  console.log(`   - https://front-*.vercel.app`);
  console.log(`   - http://localhost:*`);
  console.log('═'.repeat(60) + '\n');
}

bootstrap();