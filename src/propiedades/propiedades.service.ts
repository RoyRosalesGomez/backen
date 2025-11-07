import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async create(dto: CreatePropiedadDto): Promise<Propiedad> {
  if (!dto.farmerId) {
    // Con el controller corregido, esto ya no debería ocurrir.
    throw new BadRequestException('farmerId requerido');
  }

  const propiedad = this.propiedadesRepository.create({
    nombre: dto.nombre,
    localizacion: dto.localizacion,
    tamano: dto.tamano,
    comentario: dto.comentario ?? null,
    active: true,
    farmerId: dto.farmerId,
    farmer: { id: dto.farmerId } as any,
  });

  const saved = await this.propiedadesRepository.save(propiedad);
  return this.findOne(saved.id);
}

  async findAll(farmerId?: number, active?: boolean): Promise<Propiedad[]> {
    const qb = this.propiedadesRepository
      .createQueryBuilder('propiedad')
      .leftJoinAndSelect('propiedad.farmer', 'farmer')
      .orderBy('propiedad.createdAt', 'DESC');

    if (farmerId) {
      qb.andWhere('propiedad.farmerId = :farmerId', { farmerId });
    }

    if (active !== undefined) {
      qb.andWhere('propiedad.active = :active', { active });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Propiedad> {
    const propiedad = await this.propiedadesRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });
    if (!propiedad) throw new NotFoundException('Propiedad no encontrada');
    return propiedad;
  }

  async update(id: number, dto: UpdatePropiedadDto): Promise<Propiedad> {
    const propiedad = await this.findOne(id);
    Object.assign(propiedad, dto);
    await this.propiedadesRepository.save(propiedad);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const propiedad = await this.findOne(id);
    await this.propiedadesRepository.remove(propiedad);
  }

  async toggleActive(id: number): Promise<Propiedad> {
    const propiedad = await this.findOne(id);
    propiedad.active = !propiedad.active;
    await this.propiedadesRepository.save(propiedad);
    return this.findOne(id);
  }
}
