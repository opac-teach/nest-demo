import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
    OneToMany,
} from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { CommentEntity } from "@/comment/entities/comment.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    password: string;

    @Column()
    description: string;

    @OneToMany(() => CatEntity, (cat) => cat.owner)
    cats: CatEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.author)
    comments: CommentEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}