import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Returns a status message' })
  healthCheck(): string {
    return 'OK';
  }
}
