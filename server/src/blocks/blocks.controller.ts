import { Controller, Get } from '@nestjs/common';

@Controller('blocks')
export class BlocksController {
  constructor() {}
  @Get()
  getBlocks() {}
}
