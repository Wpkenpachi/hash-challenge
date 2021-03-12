import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  price_in_cents!: number;

  @Column()
  title!: string;

  @Column()
  description!: string
}