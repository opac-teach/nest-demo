import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CatResponseDto, CatsResponseDto } from './dtos';
import { CreateCatDto, UpdateCatDto } from './dtos/cats-input.dto';
import { genRandId } from 'src/utils/genrand';

@Injectable()
export class CatsService {
  private readonly cats: CatResponseDto[] = [
    {
      id: genRandId(),
      name: 'Tom',
      age: 32,
    },
    {
      id: genRandId(),
      name: 'Jerry',
      age: 24,
    },
  ];

  findAll(): CatsResponseDto {
    return {
      cats: this.cats,
    };
  }

  findOne(id: string): CatResponseDto {
    const cat = this.cats.find((cat) => cat.id === id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  create(cat: CreateCatDto): CatResponseDto {
    const newCat = {
      id: genRandId(),
      name: cat.name,
      age: cat.age,
    };
    this.cats.push(newCat);
    return newCat;
  }

  update(id: string, cat: UpdateCatDto): CatResponseDto {
    const index = this.cats.findIndex((cat) => cat.id === id);

    if (index === -1) {
      throw new NotFoundException('Cat not found');
    }

    this.cats[index] = {
      ...this.cats[index],
      ...cat,
    };
    return this.cats[index];
  }
}
