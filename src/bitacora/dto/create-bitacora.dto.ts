import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBitacoraDto {
  @ApiProperty({ example: 'Siembra' })
  @IsString()
  tipoActividad: string;

  @ApiProperty({ example: 'Chayote' })
  @IsString()
  tipoCultivo: string;

  @ApiProperty({ example: '2025-01-10' })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({ example: '2025-01-12' })
  @IsDateString()
  fechaFin: string;

  @ApiProperty({ example: 'Siembra de chayotes en lote norte' })
  @IsString()
  detalle: string;

  @ApiProperty({ example: 'Lote A-1' })
  @IsString()
  lote: string;

  @ApiProperty({ example: 'Condiciones climáticas favorables', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: '2 hectáreas' })
  @IsString()
  cantidad: string;

  @ApiProperty({ example: 1 })
  farmerId: number;
}