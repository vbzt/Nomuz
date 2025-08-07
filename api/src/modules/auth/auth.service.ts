import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { RegisterUserDTO } from './dto/register-user.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { randomBytes } from 'crypto';
import { InjectResend } from 'nest-resend';
import { Resend } from 'resend';
import { ResetPasswordEmailDTO } from './dto/reset-password-email.dto';
import { renderTemplate } from 'src/common/utils/renderTemplate';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly JWTService: JwtService, 
    private readonly userService: UserService,
    @InjectResend() private readonly resendClient: Resend
    ){} 

    createJwtToken( user: User ){ 
      const token = this.JWTService.sign( 
        { id: user.id, name: user.name, email: user.email },
        { 
          expiresIn: '3 days',
          subject: user.id,
          issuer: 'login',
          audience: 'users'
        } 
      )

      return token 
    }

    checkToken(token: string){ 
      try {
        const userInfo = this.JWTService.verify( token, { audience: 'users', issuer: 'login' } )
        return userInfo
      } catch (e) {
        throw new BadRequestException(e)
      }
    }


    async register( data: RegisterUserDTO ){ 
      if(data.confirmPassword !== data.password) throw new BadRequestException('A senha e a confirmação da senha devem ser iguais.')
      const { confirmPassword, ...userData} = data
      const user = await this.userService.create(userData)
      const token = this.createJwtToken(user)

      return { 
        message: "Usuário cadastrado com sucesso.",
        JWTtoken: token,
      }
    }

    async login( data: LoginDTO ){ 
      const user = await this.prismaService.user.findUnique( { where: { email: data.email } } )
      if(!user) throw new UnauthorizedException("Email ou senha incorretos.")
      const comparePassword = await bcrypt.compare(data.password, user.password)
      if(!comparePassword) throw new UnauthorizedException("Email ou senha incorretos.")
      const token = this.createJwtToken(user)
      return {
        message: "Login realizado com sucesso.",
        JWTtoken: token,
      }
    }

    

    async forgotPassword({ email }: ForgotPasswordDTO){ 
      const user = await this.userExists(email)

      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date() 
      expiresAt.setMinutes(expiresAt.getMinutes() + 10)
      const emailData = { token, email }

      await this.prismaService.resetPasswordToken.create({ data: { token, user_id: user.id, expiresAt } } )
      await this.sendResetPasswordEmail(emailData)
      return { message: "Um email contendo instruções para realizar a troca de senha foi enviado."}
    }


    async sendResetPasswordEmail(data: ResetPasswordEmailDTO){ 
      const resetLink = `https://localhost:3000/auth/reset/${data.token}`
      const html = renderTemplate('reset-password', { baseUrl: "https://localhost:3000/", resetLink})

      await this.resendClient.emails.send( { from: 'Acme <onboarding@resend.dev>', to: data.email, subject: `Intruções para a troca de senha da conta ${data.email}`, html} )
    } 


   async resetPassword(data: ResetPasswordDTO, token: string){ 
    const tokenInfo = await this.prismaService.resetPasswordToken.findUnique( { where: { token } } )
    if(!tokenInfo || tokenInfo.used || tokenInfo.expiresAt.getTime() < Date.now()) throw new NotFoundException("Este token de recuperação não existe ou está expirado.")
    
    const userInfo = await this.userExists(data.email)
    if(tokenInfo.user_id !== userInfo.id) throw new BadRequestException("O token de ")

    await this.prismaService.resetPasswordToken.update( { where: { id: tokenInfo.id }, data: { used: true } } )
    await this.userService.update({ password: data.password }, userInfo.id )

    return { message: "Senha atualizada com sucesso."}
   }
    async userExists(email: string){ 
      const user = await this.prismaService.user.findUnique( { where: { email } } )
      if(!user) throw new NotFoundException('O usuário não existe.')
      return user 
    }
}
