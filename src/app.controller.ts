import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/csv-to-json')
  async csvToJson(): Promise<any> {
    return this.appService.csvToJson();
  }
}
