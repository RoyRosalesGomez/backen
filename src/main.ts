// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // ⚠️ CORS robusto: permite localhost y 127.0.0.1
  app.enableCors({
    origin: (origin, cb) => {
      const allowlist = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      if (!origin || allowlist.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Cache-Control',
    credentials: false, // pon true solo si usas cookies/sesión
    maxAge: 86400,
  });

  // 🛟 Fallback para preflight antes de guards/filters (por si algo los intercepta)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
  console.log('🚀 Backend en http://localhost:3002');
}
bootstrap();
