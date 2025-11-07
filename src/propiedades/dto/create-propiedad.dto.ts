// dto/create-propiedad.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropiedadDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  localizacion: string;

  @IsString() @IsNotEmpty()
  tamano: string;

  @IsOptional() @IsString()
  comentario?: string;

  @IsOptional()              // ⬅️ opcional aquí
  @Type(() => Number)
  @IsNumber()
  farmerId?: number;         // ⬅️ opcional aquí
}
