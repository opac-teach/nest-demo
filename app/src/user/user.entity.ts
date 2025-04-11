import { CatEntity } from '@/cat/cat.entity';
import { CommentEntity } from '@/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  description: string;

  @OneToMany(() => CatEntity, (cat) => cat.user, {
    cascade: true,
  })
  cats?: CatEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments?: CommentEntity[];
}
