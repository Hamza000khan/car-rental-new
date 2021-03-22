import { CarCategory } from '@app/api/car-category/models/car-category.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// # Car model/entity for the database storage
@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(type => CarCategory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'car_category_id' })
  carCategory!: CarCategory;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  price!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;
}
