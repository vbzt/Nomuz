import { Body, Controller, Param, Post } from '@nestjs/common';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService ){ }

  @Post('/register')
  async register(@Body() data: RegisterUserDTO){ 
    return this.authService.register(data)
  }

  @Post('/login')
  async login(@Body() data: LoginDTO){
    return this.authService.login(data)
  }

  @Post('/forgot')   
  async forgotPassword(@Body() data: ForgotPasswordDTO){  
    return this.authService.forgotPassword(data)
  }

  @Post("/reset/:token")
  async resetPassword(@Body() data: ResetPasswordDTO, @Param("token") token: string){
    return this.authService.resetPassword(data, token)
  }
}
