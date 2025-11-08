// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // si usas /api en el frontend, déjalo
  app.setGlobalPrefix('api');

  // ✅ Dominios permitidos (exactos). Agrega más si usas previews.
  const ALLOWLIST = new Set<string>([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://front-topaz-two.vercel.app', // ← tu dominio en Vercel (HTTPS)
  ]);

  const isAllowed = (origin?: string | null) => {
    // Permite requests sin Origin (curl, health checks)
    if (!origin) return true;
    return ALLOWLIST.has(origin);
  };

  app.enableCors({
    origin: (origin, cb) => {
      if (isAllowed(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With',
    exposedHeaders: 'Content-Range, X-Total-Count',
    credentials: false,        // pon true solo si vas a usar cookies/sesión
    maxAge: 86400,
  });

  // 🔁 Fallback explícito para preflight OPTIONS (por si algún guard lo intercepta)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin as string | undefined;
      if (isAllowed(origin)) {
        if (origin) res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With');
        if (false /* credentials */) {
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.sendStatus(204);
      }
      return res.sendStatus(403);
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
  console.log('🚀 Backend en http://localhost:3002');
}
bootstrap();
