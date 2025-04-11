import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from '@/users/entities/users.entity';
import { CatEntity } from '@/cat/entities/cat.entity';

@Entity()
export class CommentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  userId: number;

  @Column()
  catId: number;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @ManyToOne(() => CatEntity, (cat: CatEntity) => cat.comments)
  @JoinColumn({ name: 'catId' })
  cat: CatEntity;

}
