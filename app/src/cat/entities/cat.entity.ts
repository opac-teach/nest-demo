import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn, OneToMany,
} from 'typeorm';

import { BreedEntity } from '@/breed/breed.entity';
import { UsersEntity } from '@/users/entities/users.entity';
import { CommentEntity } from '@/comments/entities/comment.entity';

@Entity('cat')
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breedId: number;

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

  @Column()
  userId:number

  @ManyToOne(() => UsersEntity, (user) => user.cats)
  @JoinColumn({ name: 'userId' })
  user?: UsersEntity;

  @OneToMany(() => CommentEntity, comment => comment.cat)
  comments?: CommentEntity[];
}
