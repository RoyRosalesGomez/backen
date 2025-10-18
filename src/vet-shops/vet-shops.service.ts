import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VetShop } from './entities/vet-shop.entity';
import { CreateVetShopDto } from './dto/create-vet-shop.dto';
import { UpdateVetShopDto } from './dto/update-vet-shop.dto';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class VetShopsService {
  constructor(
    @InjectRepository(VetShop)
    private vetShopsRepository: Repository<VetShop>,
    private readonly activity: ActivityService,
  ) {}

  async create(createVetShopDto: CreateVetShopDto): Promise<VetShop> {
    const vetShop = this.vetShopsRepository.create(createVetShopDto);
     const saved = await this.vetShopsRepository.save(vetShop); // ✅ ahora sí existe `saved`
   

    // ✅ Actividad: creada
    await this.activity.log({
      type: 'VETSHOP_CREATED',
      title: 'Agro veterinaria creada',
      description: `${saved.name} registrada en ${saved.location}`,
      meta: { vetShopId: saved.id, active: saved.active },
    });

    return saved;
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
    const updated = await this.vetShopsRepository.save(vetShop); // ✅ ahora sí existe `updated`
    
  

   await this.activity.log({
      type: 'VETSHOP_TOGGLED', // o crea un nuevo tipo 'VETSHOP_UPDATED'
      title: 'Agro veterinaria actualizada',
      description: `${updated.name} fue actualizada`,
      meta: { vetShopId: updated.id },
    });
    return updated;
  }

  async remove(id: number): Promise<void> {
    const vetShop = await this.findOne(id);
    await this.vetShopsRepository.remove(vetShop);
  }

  async toggleActive(id: number): Promise<VetShop> {
    const vetShop = await this.findOne(id);
    const current = await this.findOne(id);
     const updated = await this.update(id, { active: !current.active }); // ✅ `updated` definido
   

    // ✅ Actividad: activada/desactivada
    await this.activity.log({
      type: 'VETSHOP_TOGGLED',
      title: `Agro veterinaria ${updated.active ? 'activada' : 'desactivada'}`,
      description: `${updated.name} se ${updated.active ? 'activó' : 'desactivó'}`,
      meta: { vetShopId: updated.id, active: updated.active },
    });

    return updated;
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