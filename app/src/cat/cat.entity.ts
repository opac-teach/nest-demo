import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { BreedEntity } from '../breed/breed.entity';

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

  @ManyToOne(() => UserEntity, (user) => user.cats)
  user: UserEntity;
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
}
