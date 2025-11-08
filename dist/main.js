"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const ALLOWLIST = new Set([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://front-topaz-two.vercel.app',
    ]);
    const isAllowed = (origin) => {
        if (!origin)
            return true;
        return ALLOWLIST.has(origin);
    };
    app.enableCors({
        origin: (origin, cb) => {
            if (isAllowed(origin))
                return cb(null, true);
            cb(new Error(`CORS blocked: ${origin}`));
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With',
        exposedHeaders: 'Content-Range, X-Total-Count',
        credentials: false,
        maxAge: 86400,
    });
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            const origin = req.headers.origin;
            if (isAllowed(origin)) {
                if (origin)
                    res.header('Access-Control-Allow-Origin', origin);
                res.header('Vary', 'Origin');
                res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With');
                if (false) {
                    res.header('Access-Control-Allow-Credentials', 'true');
                }
                return res.sendStatus(204);
            }
            return res.sendStatus(403);
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
    console.log('🚀 Backend en http://localhost:3002');
}
bootstrap();
//# sourceMappingURL=main.js.map