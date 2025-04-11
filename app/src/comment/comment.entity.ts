import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { CatEntity } from '@/cat/cat.entity';
  import { User } from '@/user/user.entity';
  
  @Entity('comment')
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @ManyToOne(() => CatEntity, (cat) => cat.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'catId' })
    cat: CatEntity;
  
    @Column()
    catId: string;
  
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  