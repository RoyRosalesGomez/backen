import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private cultivosRepository: Repository<Cultivo>,
  ) {}

  async create(createCultivoDto: CreateCultivoDto): Promise<Cultivo> {
    const cultivo = this.cultivosRepository.create({
      ...createCultivoDto,
      farmer: { id: createCultivoDto.farmerId } as any,
    });

    return this.cultivosRepository.save(cultivo);
  }

  async findAll(farmerId?: number, active?: boolean): Promise<Cultivo[]> {
    const query = this.cultivosRepository.createQueryBuilder('cultivo')
      .leftJoinAndSelect('cultivo.farmer', 'farmer');

    if (farmerId) {
      query.andWhere('cultivo.farmerId = :farmerId', { farmerId });
    }

    if (active !== undefined) {
      query.andWhere('cultivo.active = :active', { active });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Cultivo> {
    const cultivo = await this.cultivosRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });

    if (!cultivo) {
      throw new NotFoundException('Cultivo no encontrado');
    }

    return cultivo;
  }

  async update(id: number, updateCultivoDto: UpdateCultivoDto): Promise<Cultivo> {
    const cultivo = await this.findOne(id);
    Object.assign(cultivo, updateCultivoDto);
    return this.cultivosRepository.save(cultivo);
  }

  async remove(id: number): Promise<void> {
    const cultivo = await this.findOne(id);
    await this.cultivosRepository.remove(cultivo);
  }

  async toggleActive(id: number): Promise<Cultivo> {
    const cultivo = await this.findOne(id);
    return this.update(id, { active: !cultivo.active });
  }
}