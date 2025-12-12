import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class TicketsService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly ai: AiService) 
    {}

    findAll(page = 1, limit = 10) {
        return this.prisma.ticket.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        })
    }

    findOne(id: string) {
        return this.prisma.ticket.findUnique({
            where: { id }
        })
    }

    async create(createTicketDto: CreateTicketDto) {
        const aiResult = await this.ai.categorizeTicket(createTicketDto.description);
        return this.prisma.ticket.create({
            data: {
                title: createTicketDto.title,
                description: createTicketDto.description,
                category: aiResult.category
            },
        });
    }

    update(id: string, ticket: UpdateTicketDto) {
        return this.prisma.ticket.update({
            where: { id },
            data: ticket,
        });
    }

    delete(id: string) {
        return this.prisma.ticket.delete({
            where: { id },
        })
    }
}
