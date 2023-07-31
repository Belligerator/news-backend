import { Injectable } from '@nestjs/common';
const { version } = require('../package.json');

@Injectable()
export class AppService {
  
  /**
   * Function returns backend version.
   * @returns backend version.
   */
  public getVersion(): string {
    return version;
  }
}
