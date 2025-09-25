import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVetShopDto {
  @ApiProperty({ example: 'AgroVet Central' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'info@agrovetcentral.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+506 2234-5678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'San José Centro' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Avenida Central, Calle 5, San José' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'https://example.com/logo.jpg', required: false })
  @IsOptional()
  @IsUrl()
  image?: string;
}