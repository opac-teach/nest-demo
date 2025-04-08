import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';
import { CreateCrossBreedingRequestDto } from '@/cross-breeeding-request/dto/createCrossBreedingRequest.dto';
import { AuthGuard } from '@/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrossBreedingRequestEntity } from '@/cross-breeeding-request/entity/crossBreedingRequest.entity';

@Controller('cross-breeeding-request')
export class CrossBreeedingRequestController {
  constructor(
    private readonly crossBreeedingRequestService: CrossBreeedingRequestService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ask for cross breeding' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created cross breeding request',
    type: CrossBreedingRequestEntity,
  })
  async createCrossBreedingRequest(
    @Body() createCrossBreedingRequest: CreateCrossBreedingRequestDto,
    @Req() req: { userId: string },
  ) {
    return await this.crossBreeedingRequestService.createCrossBreedingRequest(
      createCrossBreedingRequest,
      req.userId,
    );
  }
}
