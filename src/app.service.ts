import { Injectable } from '@nestjs/common';
const { version } = require('../package.json');

@Injectable()
export class AppService {
  
  public getVersion(): string {
    return version;
  }
}
