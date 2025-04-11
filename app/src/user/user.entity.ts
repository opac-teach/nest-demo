import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { CatEntity } from '@/cat/cat.entity';
  import { Comment } from '@/comment/comment.entity';
  import { Exclude } from 'class-transformer';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @OneToMany(() => CatEntity, (cat) => cat.owner)
    cats: CatEntity[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
  }
  