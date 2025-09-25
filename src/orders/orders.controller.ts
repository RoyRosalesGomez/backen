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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: number,
    @Query('farmerId') farmerId?: number,
  ) {
    return this.ordersService.findAll(status, customerId, farmerId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de órdenes' })
  getStatistics() {
    return this.ordersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar orden' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de orden' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar orden' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}