import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateCultivoDto } from './create-cultivo.dto';

export class UpdateCultivoDto extends PartialType(CreateCultivoDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}