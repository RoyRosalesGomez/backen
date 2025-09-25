import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropiedadesService } from './propiedades.service';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { UpdatePropiedadDto } from './dto/update-propiedad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('propiedades')
@Controller('propiedades')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva propiedad' })
  create(@Body() createPropiedadDto: CreatePropiedadDto) {
    return this.propiedadesService.create(createPropiedadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  findAll(
    @Query('farmerId') farmerId?: number,
    @Query('active') active?: boolean,
  ) {
    return this.propiedadesService.findAll(farmerId, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  findOne(@Param('id') id: string) {
    return this.propiedadesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar propiedad' })
  update(@Param('id') id: string, @Body() updatePropiedadDto: UpdatePropiedadDto) {
    return this.propiedadesService.update(+id, updatePropiedadDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar/Desactivar propiedad' })
  toggleActive(@Param('id') id: string) {
    return this.propiedadesService.toggleActive(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar propiedad' })
  remove(@Param('id') id: string) {
    return this.propiedadesService.remove(+id);
  }
}