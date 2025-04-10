import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn, OneToMany,
} from 'typeorm';

import { BreedEntity } from '../breed/breed.entity';
import { UserEntity } from '../user/entities/user.entity';
import {CommentEntity} from "@/comment/entities/comment.entity";

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

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => BreedEntity, (breed) => breed.id)
  @JoinColumn({ name: 'breedId' })
  breed?: BreedEntity;

  @ManyToOne(() => UserEntity, (user) => user.cats)
  owner: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.cat)
  comments: CommentEntity[];

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
