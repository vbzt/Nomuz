import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService ){ }

  @Post('/register')
  async register(@Body() data: RegisterUserDTO, @Res({ passthrough: true} ) res: Response ){ 
    const token = await this.authService.register(data)
    res.cookie( 'jwt', token, { httpOnly: true, secure: false, sameSite: 'lax' } )
    return { message: "Usuário cadastrado com sucesso." }
  } 

  @Post('/login')
  async login(@Body() data: LoginDTO, @Res({ passthrough: true } ) res: Response ) {
    const token =  await this.authService.login(data)
    res.cookie( 'jwt', token, { httpOnly: true, secure: false, sameSite: 'lax' } )
    return { message: "Login realizado com sucesso.", token }
  }

  @Post('logout')
  async logout( @Res({ passthrough: true } ) res: Response ){ 
    res.clearCookie('jwt')
    return
  }

  @Post('/forgot')   
  async forgotPassword(@Body() data: ForgotPasswordDTO){  
    return this.authService.forgotPassword(data)
  }

  @Post("/reset/:token")
  async resetPassword(@Body() data: ResetPasswordDTO, @Param("token", new ParseUUIDPipe( { version: "4" } ) ) token: string, @Res({ passthrough: true } ) res: Response){
    const newJwtToken =  await this.authService.resetPassword(data, token)
    res.cookie( 'jwt', newJwtToken, { httpOnly: true, secure: false, sameSite: 'lax' } )
    return { message: "Senha atualizada com sucesso."}
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getProfile(@Req() req: Request){ 
    return req.user
  }
}
