import { BreedService } from '@/breed/breed.service';
import { BreedResponseDto } from '@/breed/dtos';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import {
  Resolver,
  Query,
  Args,
  Parent,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';

@Resolver(() => CatResponseDto)
export class CatResolver {
  constructor(
    private catService: CatService,
    private breedService: BreedService,
  ) {}

  @Query(() => [CatResponseDto]) // GET '/cat'
  async cats(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true });
  }

  @Query(() => CatResponseDto) // GET '/cat/:id'
  async cat(@Args('id') id: string): Promise<CatResponseDto> {
    const cat = await this.catService.findOne(id, true);
    return new CatResponseDto(cat);
  }

  @ResolveField(() => BreedResponseDto)
  breed(@Parent() cat: CatResponseDto): Promise<BreedResponseDto> {
    return this.breedService.findOne(cat.breedId);
  }

  @Mutation(() => CatResponseDto)
  async createCat(@Args('cat') cat: CreateCatDto): Promise<CatResponseDto> {
    return this.catService.create(cat);
  }

  @Mutation(() => CatResponseDto)
  async updateCat(
    @Args('id') id: string,
    @Args('cat') cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }
}
