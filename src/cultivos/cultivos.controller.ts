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
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/cultivos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `cultivo-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async create(
    @Body() createCultivoDto: CreateCultivoDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    const u = req.user ?? {};
    // Intenta body primero, si no, toma del token (sub/id)
    const farmerId =
      Number.isFinite(Number(createCultivoDto.farmerId)) ? Number(createCultivoDto.farmerId)
      : Number(u.sub ?? u.id ?? u.userId);

    if (!Number.isFinite(farmerId)) {
      throw new BadRequestException('farmerId requerido');
    }

    createCultivoDto.farmerId = farmerId;

    // Si se subió un archivo, agregar la ruta
    if (file) {
      createCultivoDto.image = `/uploads/cultivos/${file.filename}`;
    }

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