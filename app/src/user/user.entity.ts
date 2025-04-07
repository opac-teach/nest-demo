import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {CatEntity} from "@/cat/cat.entity";
import * as bcrypt from 'bcrypt';
import {Exclude} from "class-transformer";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Length(10, 50)
    @IsNotEmpty()
    name: string

    @Column('text')
    description: string

    @Column({ length: 255, unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column({ length: 255 })
    @Exclude()
    password: string

    @OneToMany(() => CatEntity, cat => cat.owner)
    cats: CatEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}
