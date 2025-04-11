import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { Exclude } from 'class-transformer';
import { CommentEntity } from '@/comments/entities/comment.entity';
import { RolesEnum } from '@/auth/roles/roles.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column()
  biography: string;

  @Column({ default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats: CatEntity[];

  @ManyToOne(() => CommentEntity, (comment) => comment.cat)
  comments?: CommentEntity[];
}
