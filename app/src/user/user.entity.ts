import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { IsEmail } from 'class-validator';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats: CatEntity[];
}
