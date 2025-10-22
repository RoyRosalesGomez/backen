"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: (origin, cb) => {
            const allowlist = [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
            ];
            if (!origin || allowlist.includes(origin))
                return cb(null, true);
            cb(new Error(`CORS blocked: ${origin}`));
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization, Cache-Control, Pragma',
        credentials: false,
        maxAge: 86400,
    });
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
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
    console.log('🚀 Backend en http://localhost:3002');
}
bootstrap();
//# sourceMappingURL=main.js.map