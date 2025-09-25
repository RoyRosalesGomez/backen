import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BitacoraEntry } from './entities/bitacora.entity';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';

@Injectable()
export class BitacoraService {
  constructor(
    @InjectRepository(BitacoraEntry)
    private bitacoraRepository: Repository<BitacoraEntry>,
  ) {}

  async create(createBitacoraDto: CreateBitacoraDto): Promise<BitacoraEntry> {
    const entry = this.bitacoraRepository.create({
      ...createBitacoraDto,
      farmer: { id: createBitacoraDto.farmerId } as any,
    });

    return this.bitacoraRepository.save(entry);
  }

  async findAll(farmerId?: number): Promise<BitacoraEntry[]> {
    const query = this.bitacoraRepository.createQueryBuilder('entry')
      .leftJoinAndSelect('entry.farmer', 'farmer');

    if (farmerId) {
      query.andWhere('entry.farmerId = :farmerId', { farmerId });
    }

    return query.orderBy('entry.fechaInicio', 'DESC').getMany();
  }

  async findOne(id: number): Promise<BitacoraEntry> {
    const entry = await this.bitacoraRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });

    if (!entry) {
      throw new NotFoundException('Entrada de bitácora no encontrada');
    }

    return entry;
  }

  async update(id: number, updateBitacoraDto: UpdateBitacoraDto): Promise<BitacoraEntry> {
    const entry = await this.findOne(id);
    Object.assign(entry, updateBitacoraDto);
    return this.bitacoraRepository.save(entry);
  }

  async remove(id: number): Promise<void> {
    const entry = await this.findOne(id);
    await this.bitacoraRepository.remove(entry);
  }
}