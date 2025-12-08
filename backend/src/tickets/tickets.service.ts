import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
        })
    }

    findOne(id: string) {
        return this.prisma.ticket.findUnique({
            where: { id }
        })
    }

    create(createTicketDto: CreateTicketDto) {
        return this.prisma.ticket.create({
            data: {
                title: createTicketDto.title,
                description: createTicketDto.description,
            },
        });
     }
}
