import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

export enum ProductStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductCategory {
  FRUTAS = 'frutas',
  VERDURAS = 'verduras',
  GRANOS = 'granos',
  OTROS = 'otros',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  unit: string;

  @Column()
  stock: number;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    default: ProductCategory.OTROS,
  })
  category: ProductCategory;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status: ProductStatus;

  @Column({ default: true })
  active: boolean;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.products)
  farmer: User;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];
}