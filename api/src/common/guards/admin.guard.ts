import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLE } from '@prisma/client';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor ( private readonly userService: UserService){}

  async canActivate(context: ExecutionContext):Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const user = req.user 
    const userRole = await this.userService.readOne(user.id)
    if(!userRole || userRole.role !== ROLE.ADMIN) throw new UnauthorizedException('Você deve ser um admin para acessar essa rota.')

    return true 
    
  }
}
