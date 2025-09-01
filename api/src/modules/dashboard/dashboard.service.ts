import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor( private readonly prismaService: PrismaService){}
  
  async getStatistics(req: AuthenticatedRequest) {
  const now = new Date()
  const year = now.getFullYear() 

  const startOfYear = new Date(year, 0, 1)   
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999) 

  const monthlyInteractions = await this.prismaService.message.groupBy({
    by: ["createdAt"],
    where: {
      sender_id: req.user.id,
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    _count: { _all: true },
  })

  const grouped: Record<string, number> = {}
  for (const msg of monthlyInteractions) {
    const month = msg.createdAt.toISOString().slice(0, 7)
    grouped[month] = (grouped[month] || 0) + 1
  }

  const result: { month: string; total: number }[] = []
  for (let m = 0; m < 12; m++) {
    const d = new Date(year, m, 1)
    const key = d.toISOString().slice(0, 7)
    result.push({
      month: key,
      total: grouped[key] || 0,
    })
  }

  return result
}

}
