import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import CrossBreedingRequestStatus from '@/lib/crossBreedingRequestStatus.enum';

@Entity()
export class CrossBreedingRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  askingUserId: string;

  @Column()
  askingCatId: string;

  @Column()
  askedUserId: string;

  @Column()
  askedCatId: string;

  @Column()
  status: CrossBreedingRequestStatus;
}
