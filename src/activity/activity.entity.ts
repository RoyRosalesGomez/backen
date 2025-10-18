import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type ActivityType =
  | 'USER_CREATED'
  | 'USER_STATUS_CHANGED'
  | 'PRODUCT_SUBMITTED'
  | 'PRODUCT_APPROVED'
  | 'PRODUCT_REJECTED'
  | 'VETSHOP_CREATED'
  | 'VETSHOP_TOGGLED';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  type: ActivityType;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Para MySQL usa 'simple-json'; para Postgres puedes usar 'jsonb'
  @Column({ type: 'simple-json', nullable: true })
  meta?: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
