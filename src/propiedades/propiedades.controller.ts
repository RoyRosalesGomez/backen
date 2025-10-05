import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseGuards, Req
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
  create(@Body() dto: CreatePropiedadDto, @Req() req) {
    // Si el rol es farmer, ignoramos lo que venga y usamos el id del token
    const farmerId =
      req.user?.role === 'farmer' ? Number(req.user.id) : Number(dto.farmerId);
    return this.propiedadesService.create({ ...dto, farmerId });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  findAll(@Query() q: any, @Req() req) {
    // ⚠️ Los query params llegan como strings
    let farmerId: number | undefined;
    let active: boolean | undefined;

    if (req.user?.role === 'farmer') {
      farmerId = Number(req.user.id);
    } else if (q.farmerId != null && q.farmerId !== '') {
      farmerId = Number(q.farmerId);
    }

    if (q.active !== undefined) {
      const v = String(q.active).toLowerCase();
      active = v === 'true' || v === '1';
    }

    return this.propiedadesService.findAll(farmerId, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  findOne(@Param('id') id: string) {
    return this.propiedadesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar propiedad' })
  update(@Param('id') id: string, @Body() dto: UpdatePropiedadDto) {
    return this.propiedadesService.update(+id, dto);
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
