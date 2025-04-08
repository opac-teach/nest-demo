import { CatEntity } from '@/cat/cat.entity';
import { CommentaireEntity } from '@/commentaire/commentaire.entity';
import { CrossRequestEntity } from '@/cross-request/cross-request.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => CatEntity, (cat) => cat.user)
  cats?: CatEntity[];

  @OneToMany(() => CommentaireEntity, (commentaire) => commentaire.user)
  commentaires?: CommentaireEntity[];

  @OneToMany(() => CrossRequestEntity, (crossRequest) => crossRequest.sender)
  sentCrossRequests?: CrossRequestEntity[];

  @OneToMany(() => CrossRequestEntity, (crossRequest) => crossRequest.receiver)
  receivedCrossRequests?: CrossRequestEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
