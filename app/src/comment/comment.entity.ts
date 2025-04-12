import {BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";
import {UserEntity} from "@/user/user.entity";
import {CatEntity} from "@/cat/cat.entity";

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Length(10, 50)
    @IsNotEmpty()
    title: string

    @Column('text')
    text: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @Column()
    authorId: String

    @Column()
    catId: String

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToOne(() => UserEntity, user => user.comments, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity;

    @ManyToOne(() => CatEntity, cat => cat.comments, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'catId' })
    cat: CatEntity;
}
