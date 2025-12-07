import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('tickets')
export class TicketsController {
  @Get()
  findAll() {
    return 'List tickets (placeholder)';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Ticket ${id} (placeholder)`;
  }

  @Post()
  create(@Body() body: any) {
    return { message: 'Create ticket (placeholder)', body };
  }
}
