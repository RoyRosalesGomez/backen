"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        cors: true,
    });
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((req, res, next) => {
        const origin = req.headers.origin;
        const allowedOrigins = [
            'https://front-topaz-two.vercel.app',
            /^https:\/\/front-[a-z0-9-]+\.vercel\.app$/,
            /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173|4200|8080)$/,
        ];
        const isAllowed = (origin) => {
            if (!origin)
                return true;
            return allowedOrigins.some((rule) => typeof rule === 'string' ? rule === origin : rule.test(origin));
        };
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📥 ${req.method} ${req.url}`);
        console.log(`🌐 Origin: ${origin || 'NO ORIGIN'}`);
        console.log(`🔒 Allowed: ${isAllowed(origin)}`);
        if (req.method === 'OPTIONS') {
            console.log(`⚡ PREFLIGHT OPTIONS - Respondiendo inmediatamente`);
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
        if (origin) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Vary', 'Origin');
            console.log(`✅ Headers CORS agregados`);
        }
        console.log(`${'='.repeat(60)}\n`);
        next();
    });
    app.setGlobalPrefix('api');
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
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
//# sourceMappingURL=main.js.map