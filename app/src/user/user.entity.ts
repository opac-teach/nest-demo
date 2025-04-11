import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  BeforeInsert,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { CatEntity } from '@/cat/cat.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class userEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  description : string; 

  @Column()
  age : number;

  @Column()
  sexe : string;

  @OneToMany(()=> CatEntity, (cat) => cat.id )
  @JoinColumn({ name : 'catId'})
  cat?: CatEntity;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;
  
  @Column( )
  email: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
