import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly JWTService: JwtService, 
    private readonly userService: UserService){} 

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
      const user = await this.userService.create(data)
      return this.createJwtToken(user)
    }

    async login( data: LoginDTO ){ 
      const user = await this.userExists(data.email)
      const comparePassword = await bcrypt.compare(data.password, user.password)
      if(!comparePassword) throw new UnauthorizedException("Incorrect email or password")
      return this.createJwtToken(user)
    }

    //TODO: Reset & forgot

    
    async userExists(email: string){ 
      const user = await this.prismaService.user.findUnique( { where: { email } } )
      if(!user) throw new NotFoundException('User does not exists.')
      return user 
    }
}
