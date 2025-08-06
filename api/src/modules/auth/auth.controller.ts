import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService){}

  @Post('/forgot')   
  async forgotPassword(@Body() data: ForgotPasswordDTO){  
    return this.authService.forgotPassword(data)
  }
}
