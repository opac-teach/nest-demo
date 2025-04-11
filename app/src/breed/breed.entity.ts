import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { CatEntity } from '../cat/cat.entity';

@Entity('breed')
export class BreedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => CatEntity, (cat) => cat.breed)
  cats?: CatEntity[];

  @Column()
  seed: string;

  @BeforeInsert()
  generateSeed() {
    this.seed = Math.random().toString(36).substring(2, 15);
  }
}
