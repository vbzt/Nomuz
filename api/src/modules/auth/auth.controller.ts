import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ParseCUIDPipe } from 'src/common/pipes/parse-cuid.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { UpdateProfile } from './dto/update-profile.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService, private readonly userService: UserService ){ }
   
  @UseInterceptors(FileInterceptor('file'))
  @Post('/register')
  async register(@Body() data: RegisterUserDTO, @Res({ passthrough: true} ) res: Response, @UploadedFile() file: Express.Multer.File ){ 
    const token = await this.authService.register(data, file)
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
    return { success: true }
  }

  @Post('/forgot')   
  async forgotPassword(@Body() data: ForgotPasswordDTO){  
    return this.authService.forgotPassword(data)
  }

  @Patch("/reset/:token")
  async resetPassword(@Body() data: ResetPasswordDTO, @Param("token", ParseCUIDPipe) token: string, @Res({ passthrough: true } ) res: Response){
    const newJwtToken =  await this.authService.resetPassword(data, token)
    res.cookie( 'jwt', newJwtToken, { httpOnly: true, secure: false, sameSite: 'lax' } )
    return { message: "Senha atualizada com sucesso."}
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getProfile(@Req() req: Request){ 
    return req.user
  }
  
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Patch('/profile')
  async updateProfile(@Body() data: UpdateProfile, @Req() req: AuthenticatedRequest, @Res() res: Response, file?: Express.Multer.File){
    const updatedUser = await this.authService.updateProfile(data, req, file)
    res.cookie( 'jwt', updatedUser.token, { httpOnly: true, secure: false, sameSite: 'lax' } )
    return res.json(updatedUser)
  }

}
