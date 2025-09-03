import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { DashboardService } from 'src/modules/dashboard/dashboard.service';

@Injectable()
export class CommitmentAccessGuard implements CanActivate {
  constructor(private readonly dashboardService: DashboardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>  { 
    const req = context.switchToHttp().getRequest()
    const id = req.params.id
    const user = req.user
    await this.dashboardService.commitmentExists(id, user.id)
    return true

  }
}