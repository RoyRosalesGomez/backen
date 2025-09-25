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
import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cultivos')
@Controller('cultivos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo cultivo' })
  create(@Body() createCultivoDto: CreateCultivoDto) {
    return this.cultivosService.create(createCultivoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los cultivos' })
  findAll(
    @Query('farmerId') farmerId?: number,
    @Query('active') active?: boolean,
  ) {
    return this.cultivosService.findAll(farmerId, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cultivo por ID' })
  findOne(@Param('id') id: string) {
    return this.cultivosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cultivo' })
  update(@Param('id') id: string, @Body() updateCultivoDto: UpdateCultivoDto) {
    return this.cultivosService.update(+id, updateCultivoDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar/Desactivar cultivo' })
  toggleActive(@Param('id') id: string) {
    return this.cultivosService.toggleActive(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cultivo' })
  remove(@Param('id') id: string) {
    return this.cultivosService.remove(+id);
  }
}