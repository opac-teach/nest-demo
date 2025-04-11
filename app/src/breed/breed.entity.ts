import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
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
}
