import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreatePropiedadDto } from './create-propiedad.dto';

export class UpdatePropiedadDto extends PartialType(CreatePropiedadDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}