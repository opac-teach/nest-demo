import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { CrossRequestService } from './cross-request.service';
import { AuthGuard, RequestWithUser } from '@/auth/guards/auth.guard';
import { CrossRequestInputDto, CrossRequestResponseDto } from './dtos';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SerializeOptions } from '@nestjs/common';
@Controller('cross-request')
@UseGuards(AuthGuard)
export class CrossRequestController {
  constructor(private readonly crossRequestService: CrossRequestService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cross requests' })
  @ApiResponse({ status: 200, description: 'Returns all cross requests' })
  @SerializeOptions({ type: CrossRequestResponseDto })
  findAllCrossRequests(
    @Req() req: RequestWithUser,
    @Query('fromMe') fromMe?: boolean,
  ): Promise<CrossRequestResponseDto[]> {
    return this.crossRequestService.findAllCrossRequests(req.user.sub, {
      forMe: !fromMe,
      fromMe: fromMe ?? false,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a cross request' })
  @ApiResponse({ status: 200, description: 'Returns a confirmation message' })
  @SerializeOptions({ type: CrossRequestResponseDto })
  async createCrossRequest(
    @Body() crossRequestInput: CrossRequestInputDto,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.crossRequestService.createCrossRequest(
      crossRequestInput,
      req.user.sub,
    );
    return { message: 'Demande de croisement envoyée avec succès !' };
  }

  @Post(':id/answer')
  @ApiOperation({ summary: 'Answer a cross request' })
  @ApiResponse({ status: 200, description: 'Returns a confirmation message' })
  @SerializeOptions({ type: CrossRequestResponseDto })
  async answerCrossRequest(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Query('accept') accept: boolean,
  ): Promise<{ message: string }> {
    await this.crossRequestService.answerCrossRequest(id, req.user.sub, accept);
    return {
      message: `La requête a bien été ${accept ? 'acceptée' : 'refusée'} !`,
    };
  }
}
