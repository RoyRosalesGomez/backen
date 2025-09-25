import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateVetShopDto } from './create-vet-shop.dto';

export class UpdateVetShopDto extends PartialType(CreateVetShopDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}