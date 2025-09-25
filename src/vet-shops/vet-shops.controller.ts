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
import { VetShopsService } from './vet-shops.service';
import { CreateVetShopDto } from './dto/create-vet-shop.dto';
import { UpdateVetShopDto } from './dto/update-vet-shop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('vet-shops')
@Controller('vet-shops')
export class VetShopsController {
  constructor(private readonly vetShopsService: VetShopsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva agro veterinaria (Solo Admin)' })
  create(@Body() createVetShopDto: CreateVetShopDto) {
    return this.vetShopsService.create(createVetShopDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las agro veterinarias' })
  findAll(@Query('active') active?: boolean) {
    return this.vetShopsService.findAll(active);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener agro veterinarias activas' })
  findActive() {
    return this.vetShopsService.findActive();
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de agro veterinarias (Solo Admin)' })
  getStatistics() {
    return this.vetShopsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener agro veterinaria por ID' })
  findOne(@Param('id') id: string) {
    return this.vetShopsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar agro veterinaria (Solo Admin)' })
  update(@Param('id') id: string, @Body() updateVetShopDto: UpdateVetShopDto) {
    return this.vetShopsService.update(+id, updateVetShopDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/Desactivar agro veterinaria (Solo Admin)' })
  toggleActive(@Param('id') id: string) {
    return this.vetShopsService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar agro veterinaria (Solo Admin)' })
  remove(@Param('id') id: string) {
    return this.vetShopsService.remove(+id);
  }
}