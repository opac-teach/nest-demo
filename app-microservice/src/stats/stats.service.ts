import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {StatEntity} from "./stat.entity";
import {CatService} from "../cat/cat.service";

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(StatEntity)
        private readonly statsRepository: Repository<StatEntity>,
        private readonly catService: CatService
    ) {}

    async create(): Promise<void> {
        const stats = this.statsRepository.create({
            avgCatByUser: await this.catService.getAvgCatByUser(),
            avgCatByBreed: await this.catService.getAvgCatByBreed(),
            maxBreedWithCat: await this.catService.getMaxBreedWithCat(),
            maxUserWithCat: await this.catService.getMaxUserWithCat(),
        });

        await this.statsRepository.save(stats);
    }
}
