import {Column, PrimaryGeneratedColumn} from "typeorm";

export class StatEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    avgCatByUser: number

    @Column()
    avgCatByBreed: number

    @Column()
    maxBreedWithCat: string

    @Column()
    maxUserWithCat: string
}
