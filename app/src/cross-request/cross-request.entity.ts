import { UserEntity } from '@/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

export enum CrossRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('cross_requests')
export class CrossRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sentCrossRequests)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @Column()
  senderId: string;

  @ManyToOne(() => UserEntity, (user) => user.receivedCrossRequests)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserEntity;

  @Column()
  receiverId: string;

  @Column()
  senderCatId: string;

  @Column()
  receiverCatId: string;

  @Column({
    type: 'enum',
    enum: CrossRequestStatus,
    default: CrossRequestStatus.PENDING,
  })
  status: CrossRequestStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isUsed: boolean;
}
