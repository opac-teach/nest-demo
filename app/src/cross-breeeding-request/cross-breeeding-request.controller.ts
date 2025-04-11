import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get('accept/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a cross breeding request' })
  @ApiResponse({
    status: 200,
    description: 'Returns the accepted cross breeding request',
    type: CrossBreedingRequestEntity,
  })
  async acceptCrossBreedingRequest(
    @Param('id') id: number,
    @Req() req: { userId: string },
  ) {
    return await this.crossBreeedingRequestService.acceptCrossBreedingRequest(
      Number(id),
      req.userId,
    );
  }

  @Get('reject/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a cross breeding request' })
  @ApiResponse({
    status: 200,
    description: 'Returns the rejected cross breeding request',
    type: CrossBreedingRequestEntity,
  })
  async refuseCrossBreedingRequest(
    @Param('id') id: number,
    @Req() req: { userId: string },
  ) {
    return await this.crossBreeedingRequestService.refuseCrossBreedingRequest(
      Number(id),
      req.userId,
    );
  }
}
