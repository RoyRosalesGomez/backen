import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCultivoDto {
  @ApiProperty({ example: 'Chayote' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Chayote Verde' })
  @IsString()
  variedad: string;

  @ApiProperty({ example: 'Cultivo principal de la finca', required: false })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  farmerId?: number;
}