import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { BreedEntity } from '../breed/breed.entity';
import { UserEntity } from '../users/user.entity';
import { CommentaryEntity } from '@/commentary/commentary.entity';

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

  @ManyToOne(() => UserEntity, (user) => user.cats)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
 
  @OneToMany(() => CommentaryEntity, (commentary) => commentary.cat)
  @JoinColumn({ name: 'commentaryId' })
  commentaries?: CommentaryEntity[]

  @Column()
  userId: string;

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
