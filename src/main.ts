// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // ✅ Allowlist: localhost y dominios Vercel de tu proyecto (prod + previews)
  // - Prod: ajusta el dominio exacto si cambias
  // - Previews: coinciden con "front-<cualquier-cosa>.vercel.app"
  const ALLOWLIST: (string | RegExp)[] = [
    /^https?:\/\/(localhost|127\.0\.0\.1):3000$/,
    'https://front-topaz-two.vercel.app',
    /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/, // previews de Vercel
  ];

  const isAllowed = (origin?: string | null) => {
    if (!origin) return true; // curl/health checks
    return ALLOWLIST.some((rule) =>
      typeof rule === 'string' ? rule === origin : rule.test(origin),
    );
  };

  app.enableCors({
    origin: (origin, cb) => {
      if (isAllowed(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With',
    exposedHeaders: 'Content-Range, X-Total-Count',
    credentials: false, // true solo si usas cookies
    maxAge: 86400,
  });

  // 🔁 Fallback preflight explícito (por si algún guard/middleware intercepta)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin as string | undefined;
      if (isAllowed(origin)) {
        if (origin) res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        res.header(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With',
        );
        // res.header('Access-Control-Allow-Credentials', 'true'); // si credentials=true
        return res.sendStatus(204);
      }
      return res.sendStatus(403);
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
  console.log('🚀 Backend listo');
}
bootstrap();
