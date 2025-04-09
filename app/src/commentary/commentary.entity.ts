import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { CatEntity } from '../cat/cat.entity';
import { UserEntity } from '@/users/user.entity';

@Entity('commentaries')
export class CommentaryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(() => CatEntity, (cat) => cat.commentaries)
  cat: CatEntity

  @ManyToOne(() => UserEntity, (users) => users.commentaries)
  user: UserEntity

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
