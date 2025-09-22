import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitmentDTO } from './dto/create-commitment.dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { EditCommitmentDTO } from './dto/edit-commitment.dto';

@Injectable()
export class DashboardService {
  constructor( private readonly prismaService: PrismaService, private readonly userService: UserService){}
  
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

async createCommitment(req: AuthenticatedRequest, client: User, data: CreateCommitmentDTO){ 
  const commitment = await this.prismaService.commitment.create( { data: { dueDate: data.dueDate, title: data.title ,  client_id: client.id, user_id: req.user.id, client_name: client.name, client_email: client.email } } )
  return { message: "Compromisso criado com sucesso.", commitment}
}

async getCommitments(req: AuthenticatedRequest){
  return this.prismaService.commitment.findMany( { where: { user_id: req.user.id }})
}

async editCommitment(id: string, data: EditCommitmentDTO, client?: User){
 const { email, ...filter } = data;
  const updatedCommitment = await this.prismaService.commitment.update( { where: { id }, data: { ...filter, ...(client && { client_id: client.id, client_name: client.name, client_email: client.email } ) } } )
  return { message: "Compromisso atualizado com sucesso.", updatedCommitment }
} 

async commitmentExists(id: string, userId: string){ 
  const commitment = await this.prismaService.commitment.findUnique( { where: { id, user_id: userId}})
  if(!commitment) throw new NotFoundException('Este compromisso não existe.')
  return true
}

}
