import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VetShopsService } from './vet-shops.service';
import { VetShopsController } from './vet-shops.controller';
import { VetShop } from './entities/vet-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VetShop])],
  controllers: [VetShopsController],
  providers: [VetShopsService],
  exports: [VetShopsService],
})
export class VetShopsModule {}