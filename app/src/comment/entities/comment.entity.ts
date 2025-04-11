import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
    ManyToOne,
} from 'typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { UserEntity } from '@/user/entities/user.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    author: UserEntity;

    @ManyToOne(() => CatEntity, (cat) => cat.comments)
    cat: CatEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}