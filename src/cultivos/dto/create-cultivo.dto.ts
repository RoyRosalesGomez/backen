import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({ example: 1 })
  farmerId: number;
}