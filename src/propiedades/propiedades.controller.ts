import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseGuards, Req,
  BadRequestException,
  ForbiddenException
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
async create(@Body() dto: CreatePropiedadDto, @Req() req: any) {
  const u = req.user ?? {};
  // Intenta body primero, si no, toma del token (sub/id)
  const farmerId =
    Number.isFinite(Number(dto.farmerId)) ? Number(dto.farmerId)
    : Number(u.sub ?? u.id ?? u.userId);

  // (Opcional) valida rol
  // if (u.role && u.role !== 'farmer') throw new ForbiddenException('Solo agricultores pueden crear propiedades');

  if (!Number.isFinite(farmerId)) {
    // DEBUG opcional
    // console.log('[PROP CONTROLLER] req.user =', u, 'body=', dto);
    throw new BadRequestException('farmerId requerido');
  }

  dto.farmerId = farmerId;
  return this.propiedadesService.create(dto);
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
