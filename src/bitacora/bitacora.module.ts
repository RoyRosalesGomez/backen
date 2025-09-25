import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitacoraService } from './bitacora.service';
import { BitacoraController } from './bitacora.controller';
import { BitacoraEntry } from './entities/bitacora.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BitacoraEntry])],
  controllers: [BitacoraController],
  providers: [BitacoraService],
  exports: [BitacoraService],
})
export class BitacoraModule {}