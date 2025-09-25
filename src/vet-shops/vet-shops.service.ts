import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VetShop } from './entities/vet-shop.entity';
import { CreateVetShopDto } from './dto/create-vet-shop.dto';
import { UpdateVetShopDto } from './dto/update-vet-shop.dto';

@Injectable()
export class VetShopsService {
  constructor(
    @InjectRepository(VetShop)
    private vetShopsRepository: Repository<VetShop>,
  ) {}

  async create(createVetShopDto: CreateVetShopDto): Promise<VetShop> {
    const vetShop = this.vetShopsRepository.create(createVetShopDto);
    return this.vetShopsRepository.save(vetShop);
  }

  async findAll(active?: boolean): Promise<VetShop[]> {
    const query = this.vetShopsRepository.createQueryBuilder('vetShop');

    if (active !== undefined) {
      query.andWhere('vetShop.active = :active', { active });
    }

    return query.getMany();
  }

  async findActive(): Promise<VetShop[]> {
    return this.findAll(true);
  }

  async findOne(id: number): Promise<VetShop> {
    const vetShop = await this.vetShopsRepository.findOne({ where: { id } });

    if (!vetShop) {
      throw new NotFoundException('Agro veterinaria no encontrada');
    }

    return vetShop;
  }

  async update(id: number, updateVetShopDto: UpdateVetShopDto): Promise<VetShop> {
    const vetShop = await this.findOne(id);
    Object.assign(vetShop, updateVetShopDto);
    return this.vetShopsRepository.save(vetShop);
  }

  async remove(id: number): Promise<void> {
    const vetShop = await this.findOne(id);
    await this.vetShopsRepository.remove(vetShop);
  }

  async toggleActive(id: number): Promise<VetShop> {
    const vetShop = await this.findOne(id);
    return this.update(id, { active: !vetShop.active });
  }

  async getStatistics() {
    const total = await this.vetShopsRepository.count();
    const active = await this.vetShopsRepository.count({ where: { active: true } });
    const inactive = await this.vetShopsRepository.count({ where: { active: false } });

    return {
      total,
      active,
      inactive,
    };
  }
}