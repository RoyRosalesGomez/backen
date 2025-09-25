import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propiedad } from './entities/propiedad.entity';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { UpdatePropiedadDto } from './dto/update-propiedad.dto';

@Injectable()
export class PropiedadesService {
  constructor(
    @InjectRepository(Propiedad)
    private propiedadesRepository: Repository<Propiedad>,
  ) {}

  async create(createPropiedadDto: CreatePropiedadDto): Promise<Propiedad> {
    const propiedad = this.propiedadesRepository.create({
      ...createPropiedadDto,
      farmer: { id: createPropiedadDto.farmerId } as any,
    });

    return this.propiedadesRepository.save(propiedad);
  }

  async findAll(farmerId?: number, active?: boolean): Promise<Propiedad[]> {
    const query = this.propiedadesRepository.createQueryBuilder('propiedad')
      .leftJoinAndSelect('propiedad.farmer', 'farmer');

    if (farmerId) {
      query.andWhere('propiedad.farmerId = :farmerId', { farmerId });
    }

    if (active !== undefined) {
      query.andWhere('propiedad.active = :active', { active });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Propiedad> {
    const propiedad = await this.propiedadesRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });

    if (!propiedad) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    return propiedad;
  }

  async update(id: number, updatePropiedadDto: UpdatePropiedadDto): Promise<Propiedad> {
    const propiedad = await this.findOne(id);
    Object.assign(propiedad, updatePropiedadDto);
    return this.propiedadesRepository.save(propiedad);
  }

  async remove(id: number): Promise<void> {
    const propiedad = await this.findOne(id);
    await this.propiedadesRepository.remove(propiedad);
  }

  async toggleActive(id: number): Promise<Propiedad> {
    const propiedad = await this.findOne(id);
    return this.update(id, { active: !propiedad.active });
  }
}