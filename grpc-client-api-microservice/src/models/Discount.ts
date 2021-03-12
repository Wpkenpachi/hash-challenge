import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Discount extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true
  })
  title!: string;

  @Column({
    type: 'simple-json',
    default: '{}'
  })
  metadata!: {
    type?: string
    percentage?: number
  }
}