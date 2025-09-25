import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pérez González' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+506 8765-4321' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Cartago' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Paraíso, Cartago' })
  @IsString()
  residence: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FARMER })
  @IsEnum(UserRole)
  role: UserRole;
}