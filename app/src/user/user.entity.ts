import {BeforeInsert, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats: CatEntity[];
}
