import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { User } from '@prisma/client';
import { CreateCommitmentDTO } from './dto/create-commitment.dto';
import { EditCommitmentDTO } from './dto/edit-commitment.dto';
import { UserService } from '../user/user.service';
import { CommitmentAccessGuard } from 'src/common/guards/commitment-access.guard';


@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService, private readonly userService: UserService) {}

  @Get('statistcs')
  async getStatistcs(@Req() req: AuthenticatedRequest){ 
    return this.dashboardService.getStatistics(req)
  }


  @Post('commitments')
  async createCommitment(
    @Req() req: AuthenticatedRequest, 
    @Body("email", UserExistsPipe) client: User,
    @Body() data: CreateCommitmentDTO 
    ){ 
    
  }

  @UseGuards(CommitmentAccessGuard)
  @Patch('commitments/:id')
  async editCommitment(
    @Req() req: AuthenticatedRequest, 
    @Body() data: EditCommitmentDTO 
    ){ 
    if(data.clientEmail){ 
      const client = await new UserExistsPipe(this.userService).transform( data.clientEmail, { type: "body"})
    }
  }

}
