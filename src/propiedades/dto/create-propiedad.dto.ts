import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropiedadDto {
  @ApiProperty({ example: 'Finca El Progreso' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Cartago, Paraíso' })
  @IsString()
  localizacion: string;

  @ApiProperty({ example: '5 hectáreas' })
  @IsString()
  tamano: string;

  @ApiProperty({ example: 'Finca principal con cultivos diversos', required: false })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ example: 1 })
  farmerId: number;
}