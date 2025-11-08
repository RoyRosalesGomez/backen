// main.ts - Configuración CORS robusta para Railway + Vercel
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // Servir archivos estáticos desde la carpeta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 🔒 Lista blanca completa: strings exactos + RegExp para dominios dinámicos
  const ALLOWLIST: (string | RegExp)[] = [
    // Desarrollo local (múltiples puertos)
    /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173|4200|8080)$/,
    
    // 🚀 Producción Vercel - dominio específico
    'https://front-topaz-two.vercel.app',
    
    // 🌐 Vercel preview deployments (front-*.vercel.app)
    /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/,
    
    // Si tienes dominio personalizado, agrégalo aquí:
    // 'https://tudominio.com',
    // 'https://www.tudominio.com',
    
    // Si el frontend también está en Railway:
    // /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/,
  ];

  /**
   * Validación de origen contra ALLOWLIST
   * @param origin - URL del origen o undefined/null
   * @returns true si está permitido
   */
  const isAllowed = (origin?: string | null): boolean => {
    // ✅ Permitir requests sin origin (Postman, apps móviles, curl)
    if (!origin) return true;
    
    return ALLOWLIST.some((rule) =>
      typeof rule === 'string' ? rule === origin : rule.test(origin),
    );
  };

  // 🛡️ Configuración principal de CORS
  app.enableCors({
    origin: (origin, cb) => {
      if (isAllowed(origin)) {
        return cb(null, true);
      }
      console.warn(`❌ CORS BLOQUEADO: ${origin}`);
      cb(new Error(`CORS policy blocked origin: ${origin}`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-Api-Key', // Si usas API keys personalizadas
    ].join(', '),
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      'X-Content-Type-Options',
    ].join(', '),
    credentials: true, // 🔑 IMPORTANTE: permite cookies/tokens
    maxAge: 86400, // Cache preflight 24h
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 🚨 Middleware EXPRESS de emergencia para manejar OPTIONS antes de NestJS
  const expressApp = app.getHttpAdapter().getInstance();
  
  expressApp.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    
    // 🔍 Logging detallado en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${req.method} ${req.path} - Origin: ${origin || 'sin origin'}`);
    }

    // ⚡ Manejo rápido de preflight OPTIONS
    if (req.method === 'OPTIONS') {
      if (isAllowed(origin)) {
        // ✅ Origin permitido - responder con headers apropiados
        if (origin) {
          res.header('Access-Control-Allow-Origin', origin);
          res.header('Vary', 'Origin'); // Importante para CDNs/cache
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With, Accept, Origin, X-Api-Key');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
        return res.sendStatus(204);
      } else {
        // ❌ Origin bloqueado
        console.warn(`🚫 Preflight rechazado para: ${origin}`);
        return res.status(403).send('CORS policy: Origin not allowed');
      }
    }

    // 🔐 Para requests normales, agregar headers CORS dinámicamente
    if (origin && isAllowed(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    next();
  });

  // 📋 Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false, // No rechazar extras en prod (puede romper integraciones)
      disableErrorMessages: process.env.NODE_ENV === 'production', // Ocultar detalles en prod
    }),
  );

  // 🚀 Inicio del servidor
  const port = process.env.PORT ?? 3002;
  await app.listen(port, '0.0.0.0');

  // 📊 Logs informativos
  console.log('╔════════════════════════════════════════╗');
  console.log(`║  🚀 Backend listo en puerto ${port.toString().padEnd(10)}║`);
  console.log(`║  📍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(17)}║`);
  console.log('╠════════════════════════════════════════╣');
  console.log('║  🌐 Orígenes permitidos:              ║');
  ALLOWLIST.forEach((rule) => {
    const display = typeof rule === 'string' ? rule : rule.toString();
    console.log(`║     ${display.padEnd(35).substring(0, 35)}║`);
  });
  console.log('╚════════════════════════════════════════╝');
}

bootstrap();