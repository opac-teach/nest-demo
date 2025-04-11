import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({unique: true})
    username: string;

    @Column()
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    description: string

    @OneToMany(type => CatEntity, cat => cat.user)
    cats: CatEntity[];
}