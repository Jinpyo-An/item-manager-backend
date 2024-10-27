import { Controller, Get } from '@nestjs/common';

@Controller('/item-manager/app')
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
