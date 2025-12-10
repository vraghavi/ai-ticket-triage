import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AiService } from 'src/ai/ai.service';

@Controller("tickets")
export class TicketsController {

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly aiService: AiService) {}

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.ticketsService.findAll(parseInt(page) || 1, parseInt(limit) || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ticketsService.delete(id);
  }

  @Post('analyze')
  async analyze(
    @Body('description') desc: string,
    @Query('provider') provider: 'openai' | 'gemini',
  ) {
    const result = await this.aiService.categorizeTicket(desc, provider);
    return result;
  }

}
