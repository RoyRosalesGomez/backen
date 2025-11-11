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

import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, ProductCategory } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `products-${uniqueSuffix}${ext}`);
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
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    const u = req.user ?? {};
    // Intenta body primero, si no, toma del token (sub/id)
    const farmerId =
      Number.isFinite(Number(createProductDto.farmerId)) ? Number(createProductDto.farmerId)
      : Number(u.sub ?? u.id ?? u.userId);

    if (!Number.isFinite(farmerId)) {
      throw new BadRequestException('farmerId requerido');
    }

    createProductDto.farmerId = farmerId;

    // Si se subió un archivo, agregar la ruta
    if (file) {
      createProductDto.image = `/uploads/product/${file.filename}`;
    }

    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll(
    @Query('status') status?: ProductStatus,
    @Query('category') category?: ProductCategory,
    @Query('farmerId') farmerId?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(status, category, farmerId, search);
  }

  @Get('approved')
  @ApiOperation({ summary: 'Obtener productos aprobados (Marketplace)' })
  findApproved(
    @Query('category') category?: ProductCategory,
    @Query('search') search?: string,
  ) {
    return this.productsService.findApproved(category, search);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de productos (Solo Admin)' })
  getStatistics() {
    return this.productsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar producto (Solo Admin)' })
  approve(@Param('id') id: string) {
    return this.productsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar producto (Solo Admin)' })
  reject(@Param('id') id: string) {
    return this.productsService.reject(+id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/Desactivar producto' })
  toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}