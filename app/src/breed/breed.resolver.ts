import { BreedService } from './breed.service';
import { BreedResponseDto } from './dtos';
import { CatResponseDto } from '@/cat/dtos/cat-response.dto';
import { CatService } from '@/cat/cat.service';
import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CreateBreedDto } from './dtos/create-breed';

@Resolver(() => BreedResponseDto)
export class BreedResolver {
  constructor(
    private breedService: BreedService,
    private catService: CatService,
  ) {}

  @Query(() => [BreedResponseDto])
  breeds(): Promise<BreedResponseDto[]> {
    return this.breedService.findAll();
  }

  @Query(() => BreedResponseDto)
  breed(@Args('id') id: string): Promise<BreedResponseDto> {
    return this.breedService.findOne(id);
  }

  @ResolveField(() => [CatResponseDto])
  cats(@Parent() breed: BreedResponseDto): Promise<CatResponseDto[]> {
    console.log('breed', breed);
    return this.catService.findAll({ breedId: breed.id });
  }

  @Mutation(() => BreedResponseDto)
  async createBreed(
    @Args('breed') breed: CreateBreedDto,
  ): Promise<BreedResponseDto> {
    return this.breedService.create(breed);
  }
}
