// main.ts - VERSIÓN DEFINITIVA CORS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Lista de orígenes permitidos (ajusta según tus frontends)
  const allowedOrigins: Array<string | RegExp> = [
    'https://front-topaz-two.vercel.app',
    /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/,
    /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173|4200|8080)$/,
  ];

  // Si configuras FRONT_URL en producción, añádela dinámicamente (quita slash final si existe)
  const envFront = process.env.FRONT_URL;
  if (envFront && typeof envFront === 'string') {
    const normalized = envFront.replace(/\/$/, '');
    // Añadir solo si no está ya presente
    if (!allowedOrigins.some((r) => (typeof r === 'string' ? r === normalized : false))) {
      allowedOrigins.unshift(normalized);
    }
  }

  // Mostrar los orígenes permitidos al arrancar (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[CORS] Allowed origins:');
    allowedOrigins.forEach((o) => console.log('  -', o));
  }

  // Habilitar CORS con función de validación para soportar credentials correctamente
  app.enableCors({
    origin: (origin, callback) => {
      // origin === undefined for non-browser requests (curl, server-to-server)
      if (!origin) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[CORS] No Origin header (server-to-server or same-origin)`);
        }
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin),
      );

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[CORS] Origin=${origin} Allowed=${isAllowed}`);
      }

      // If allowed, accept. If not, signal false (no error thrown) so the middleware
      // simply won't set CORS headers and the browser will block the request.
      if (isAllowed) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    preflightContinue: false,
  });

  // ⚡⚡⚡ PASO 3: Ahora sí configurar NestJS
  app.setGlobalPrefix('api');

  // Archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
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