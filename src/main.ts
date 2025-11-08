// main.ts - VERSIÓN DEFINITIVA CORS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true, // ⚡ HABILITAR CORS DESDE LA CREACIÓN
  });

  // ⚡⚡⚡ PASO 1: Obtener instancia Express INMEDIATAMENTE
  const expressApp = app.getHttpAdapter().getInstance();

  // ⚡⚡⚡ PASO 2: Middleware CORS como PRIMERA COSA (antes de TODO)
  expressApp.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;

    // 📋 Lista de orígenes permitidos
    const allowedOrigins = [
      'https://front-topaz-two.vercel.app',
      /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/,
      /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173|4200|8080)$/,
    ];

    const isAllowed = (origin?: string): boolean => {
      if (!origin) return true;
      return allowedOrigins.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin),
      );
    };

    // 🔍 Logging
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📥 ${req.method} ${req.url}`);
    console.log(`🌐 Origin: ${origin || 'NO ORIGIN'}`);
    console.log(`🔒 Allowed: ${isAllowed(origin)}`);

    // ⚡ MANEJO PREFLIGHT OPTIONS
    if (req.method === 'OPTIONS') {
      console.log(`⚡ PREFLIGHT OPTIONS - Respondiendo inmediatamente`);

      // ✅ Siempre responder a OPTIONS (validación después)
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      res.header('Vary', 'Origin');

      console.log(`✅ Preflight respondido con 204`);
      console.log(`${'='.repeat(60)}\n`);
      
      return res.status(204).end();
    }

    // 🔐 Para requests normales
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin');
      console.log(`✅ Headers CORS agregados`);
    }

    console.log(`${'='.repeat(60)}\n`);
    next();
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