import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';

import { BreedEntity } from '@/breed/breed.entity';
import {UserEntity} from "@/user/user.entity";

@Entity('cat')
export class CatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breedId: string;

  @Column()
  ownerId: String

  @ManyToOne(() => BreedEntity, (breed) => breed.id)
  @JoinColumn({ name: 'breedId' })
  breed?: BreedEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @Column()
  color: string;

  @ManyToOne(() => UserEntity, user => user.cats, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;
}
