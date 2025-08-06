import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/modules/auth/auth.service";
import { UserService } from "src/modules/user/user.service";

export class AuthGuards implements CanActivate{ 
  constructor(private readonly userService: UserService, private readonly authService: AuthService){ }

  async canActivate(ctx: ExecutionContext): Promise<boolean>{
    

    const req = ctx.switchToHttp().getRequest()
    const { authorization } = req.headers
    try {
      const data = this.authService.checkToken(authorization || '')
      req.payloadData = data 
      const user = await this.userService.readOne(data.id)
      req.userData = user 
      return true
    } catch (e) {
      return false
    }
  }
}