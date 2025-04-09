import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeUpdate,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { CatEntity } from '../cat/cat.entity';
import { CommentaryEntity } from '@/commentary/commentary.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  description: string;

  @Column()
  password: string;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats?: CatEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(() => CommentaryEntity, (commentary) => commentary.user)
  commentaries: CommentaryEntity[]

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
