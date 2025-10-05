
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BitacoraService } from './bitacora.service';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bitacora')
@Controller('bitacora')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva entrada de bitácora' })
  create(@Body() dto: CreateBitacoraDto, @Req() req: any) {
    const farmerId = req.user.userId; // <- viene de JwtStrategy.validate()
    return this.bitacoraService.create(dto, farmerId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las entradas de bitácora' })
  findAll(@Query('farmerId') farmerId?: number) {
    return this.bitacoraService.findAll(farmerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener entrada de bitácora por ID' })
  findOne(@Param('id') id: string) {
    return this.bitacoraService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar entrada de bitácora' })
  update(@Param('id') id: string, @Body() dto: UpdateBitacoraDto) {
    return this.bitacoraService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar entrada de bitácora' })
  remove(@Param('id') id: string) {
    return this.bitacoraService.remove(+id);
  }
}
