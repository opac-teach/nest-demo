import {
    Entity,
    Column,
} from 'typeorm';

@Entity('cat')
export class CatEntity {
    @Column()
    breedId: string;

    @Column()
    ownerId: string
}
