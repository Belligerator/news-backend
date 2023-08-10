import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

  /**
   * Get backend version.
   * @example '0.0.1'
   * @returns backend version.
   */
  @ApiOperation({ summary: 'Get backend version.' })
  @Get()
    public getVersion(): string {
        return this.appService.getVersion();
    }
}
