import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { IsUUID } from 'class-validator';

import { BreedEntity } from '@/breed/breed.entity';
import { UserEntity } from '@/user/user.entity';
import {Exclude} from "class-transformer";
import { CommentEntity } from '@/comments/comments.entity';

@Entity('cat')
export class CatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  @IsUUID()
  @Exclude()
  breedId: string;

  @Column({ nullable: true })
  @IsUUID()
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @Column()
  color: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne(() => BreedEntity, (breed) => breed.id)
  @JoinColumn({ name: 'breedId' })
  breed?: BreedEntity;

  @ManyToOne(() => UserEntity, (user) => user.cats)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.cat)
  comments?: CommentEntity[];
}
