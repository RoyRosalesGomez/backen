import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { VetShopsModule } from './vet-shops/vet-shops.module';
import { BitacoraModule } from './bitacora/bitacora.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { PropiedadesModule } from './propiedades/propiedades.module';
import { AppController } from './app.controller';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'interchange.proxy.rlwy.net',
      port: parseInt(process.env.DB_PORT) || 31113,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'zQyxNCmCIFAYWyewsWjWACmLMxsNYRXM',
      database: process.env.DB_DATABASE || 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    VetShopsModule,
    BitacoraModule,
    CultivosModule,
    PropiedadesModule,
    ActivityModule
    
  ],
  controllers: [AppController], // <-- añade el AppController
})
export class AppModule {}
