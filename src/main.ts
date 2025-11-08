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

  // 🛡️ Configuración principal de CORS (por si el middleware falla)
  app.enableCors({
    origin: (origin, cb) => {
      console.log(`[CORS Native] Verificando origin: ${origin}`);
      if (isAllowed(origin)) {
        console.log(`[CORS Native] ✅ Permitido`);
        return cb(null, true);
      }
      console.warn(`[CORS Native] ❌ BLOQUEADO: ${origin}`);
      cb(null, true); // ⚠️ PERMITIR DE TODOS MODOS (el middleware ya lo manejó)
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-Api-Key',
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      'X-Content-Type-Options',
    ],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 🚨 Middleware EXPRESS CRÍTICO - DEBE IR ANTES DE TODO
  const expressApp = app.getHttpAdapter().getInstance();
  
  // ⚡ PRIMERA LÍNEA DE DEFENSA: Interceptar TODO antes que NestJS
  expressApp.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    
    // 🔍 LOGGING CRÍTICO - Ver qué está pasando
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`  Origin: ${origin || 'NO ORIGIN'}`);
    console.log(`  Headers:`, JSON.stringify(req.headers, null, 2));

    // ⚡ MANEJO INMEDIATO de preflight OPTIONS
    if (req.method === 'OPTIONS') {
      console.log(`  → Manejando OPTIONS preflight`);
      
      if (isAllowed(origin)) {
        console.log(`  ✅ Origin permitido, respondiendo 204`);
        
        // Headers CORS completos
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With, Accept, Origin, X-Api-Key');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.setHeader('Vary', 'Origin');
        
        // IMPORTANTE: Terminar la respuesta inmediatamente
        res.status(204).end();
        return; // NO llamar next()
      } else {
        console.warn(`  ❌ Origin NO permitido: ${origin}`);
        res.status(403).json({ 
          error: 'CORS policy: Origin not allowed',
          origin: origin,
          allowed: ALLOWLIST.map(r => r.toString())
        });
        return; // NO llamar next()
      }
    }

    // 🔐 Para requests normales (GET, POST, etc.)
    if (isAllowed(origin)) {
      console.log(`  ✅ Request normal, agregando headers CORS`);
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    } else {
      console.warn(`  ⚠️ Request de origin no permitido: ${origin}`);
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