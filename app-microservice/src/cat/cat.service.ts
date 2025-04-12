import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CatEntity} from "./cat.entity";
import {Repository} from "typeorm";

@Injectable()
export class CatService {
    constructor(
        @InjectRepository(CatEntity)
        private readonly catRepository: Repository<CatEntity>
    ) {}

    async getAvgCatByUser(): Promise<number> {
        const result = await this.catRepository
            .createQueryBuilder('cat')
            .select('COUNT(cat.id) * 1.0 / COUNT(DISTINCT cat.ownerId)', 'avg')
            .getRawOne();
        return parseFloat(result.avg);
    }

    async getAvgCatByBreed(): Promise<number> {
        const result = await this.catRepository
            .createQueryBuilder('cat')
            .select('COUNT(cat.id) * 1.0 / COUNT(DISTINCT cat.breedId)', 'avg')
            .getRawOne();
        return parseFloat(result.avg);
    }

    async getMaxBreedWithCat(): Promise<string> {
        const result = await this.catRepository
            .createQueryBuilder('cat')
            .select('cat.breedId', 'breedId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('cat.breedId')
            .orderBy('count', 'DESC')
            .limit(1)
            .getRawOne();
        return result?.breedId ?? '';
    }

    async getMaxUserWithCat(): Promise<string> {
        const result = await this.catRepository
            .createQueryBuilder('cat')
            .select('cat.ownerId', 'ownerId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('cat.ownerId')
            .orderBy('count', 'DESC')
            .limit(1)
            .getRawOne();
        return result?.ownerId ?? '';
    }

}
