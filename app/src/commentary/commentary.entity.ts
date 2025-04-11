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
  text: string;

  @Column()
  catId: string;

  @Column()
  userId: string;
  
  @ManyToOne(() => CatEntity, (cat) => cat.commentaries)
  cat: CatEntity;
  
  @ManyToOne(() => UserEntity, (users) => users.commentaries)
  user: UserEntity;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
