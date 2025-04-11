import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { UserEntity } from '@/user/entities/user.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  catId: string;

  @ManyToOne(() => CatEntity, (cat) => cat.id)
  @JoinColumn({ name: 'catId' })
  cat: CatEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
