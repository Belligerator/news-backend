import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get backend version.
   * @returns backend version.
   */
  @ApiOperation({ summary: 'Get backend version.' })
  @ApiResponse({ status: 200,  description: 'Get backend version.' })
  @Get()
  public getVersion(): string {
    return this.appService.getVersion();
  }
}
