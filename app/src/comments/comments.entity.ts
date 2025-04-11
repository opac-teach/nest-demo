import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '../users/users.entity';
import { CatEntity } from '@/cat/cat.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CatEntity)
  @JoinColumn({ name: 'catId' })
  cat: CatEntity;
}
