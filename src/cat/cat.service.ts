import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dtos/cat-input.dto';
import { CatEntity } from './cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find();
  }

  async findOne(id: string): Promise<CatEntity> {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(cat: CreateCatDto): Promise<CatEntity> {
    const newCat = this.catRepository.create(cat);
    const createdCat = await this.catRepository.save(newCat);
    return createdCat;
  }

  async update(id: string, cat: UpdateCatDto): Promise<boolean> {
    const updatedCat = await this.catRepository.update(id, cat);
    if (updatedCat.affected === 0) {
      throw new NotFoundException('Cat not found');
    }
    return true;
  }
}
