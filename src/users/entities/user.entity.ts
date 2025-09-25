import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { BitacoraEntry } from '../../bitacora/entities/bitacora.entity';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';

export enum UserRole {
  CLIENT = 'client',
  FARMER = 'farmer',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  location: string;

  @Column()
  residence: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ default: false })
  canView: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Product, product => product.farmer)
  products: Product[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToMany(() => BitacoraEntry, entry => entry.farmer)
  bitacoraEntries: BitacoraEntry[];

  @OneToMany(() => Cultivo, cultivo => cultivo.farmer)
  cultivos: Cultivo[];

  @OneToMany(() => Propiedad, propiedad => propiedad.farmer)
  propiedades: Propiedad[];
}