import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BreedEntity } from '../breed/breed.entity';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => BreedEntity, (breed) => breed.id)
  @JoinColumn({ name: 'breedId' })
  breed?: BreedEntity;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.cats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @Column()
  color: string;
}
