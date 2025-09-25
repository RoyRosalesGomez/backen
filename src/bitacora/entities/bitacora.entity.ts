import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('bitacora_entries')
export class BitacoraEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoActividad: string;

  @Column()
  tipoCultivo: string;

  @Column('date')
  fechaInicio: Date;

  @Column('date')
  fechaFin: Date;

  @Column('text')
  detalle: string;

  @Column()
  lote: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @Column()
  cantidad: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.bitacoraEntries)
  farmer: User;
}