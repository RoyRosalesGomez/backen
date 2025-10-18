import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VetShopsService } from './vet-shops.service';
import { VetShopsController } from './vet-shops.controller';
import { VetShop } from './entities/vet-shop.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([VetShop]),
  ActivityModule,
],
  controllers: [VetShopsController],
  providers: [VetShopsService],
  exports: [VetShopsService],
})
export class VetShopsModule {}