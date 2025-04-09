import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';

import { CatEntity } from '../../cat/cat.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({unique:true})
  email: string;

  @Column()
  description: string;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats: CatEntity[];
}
