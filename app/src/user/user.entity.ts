import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { BreedEntity } from '../breed/breed.entity';
import { CatEntity } from '@/cat/cat.entity';

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

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
  @Column()
  email: string;
}
