import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService){}

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
}
