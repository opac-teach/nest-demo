import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { BreedEntity } from '../breed/breed.entity';
import { UserEntity } from '@/user/entities/user.entity';
import { CommentEntity } from '@/comments/entities/comment.entity';

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

  @Column({
    nullable: true,
    default: null,
  })
  parent1Id?: string;

  @ManyToOne(() => CatEntity, (cat) => cat.id)
  @JoinColumn({ name: 'parent1Id' })
  parent1?: CatEntity;

  @Column({
    nullable: true,
    default: null,
  })
  parent2Id?: string;

  @ManyToOne(() => CatEntity, (cat) => cat.id)
  @JoinColumn({ name: 'parent2Id' })
  parent2?: CatEntity;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.cat)
  comments?: CommentEntity[];
}
