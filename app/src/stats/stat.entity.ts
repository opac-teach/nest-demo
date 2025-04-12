import {Column, PrimaryGeneratedColumn} from "typeorm";

export class StatEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    avgCatByUser: number

    @Column()
    avgCatByBreed: number

    @Column()
    maxBreedWithCat: number

    @Column()
    maxUserWithCat: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;
}
