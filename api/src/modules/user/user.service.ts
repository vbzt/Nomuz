import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor (private readonly prismaService: PrismaService){}

  async create( data: CreateUserDTO ){
    if(data.role === "ADMIN") throw new UnauthorizedException() 
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash( data.password, salt )
    return this.prismaService.user.create( { data } )
  }

  async read(){ 
    return this.prismaService.user.findMany()
  }

  async readOne(id: string){ 
    const user = await this.prismaService.user.findFirst( { where: { id }, select: { password: false } } )
    if(!user) throw new NotFoundException("User does not exists.")
    return user
  }

  async update(data: UpdateUserDTO, id: string){ 
    if(data.password){ 
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash( data.password, salt )
    }
    try {
      const updatedUser = await this.prismaService.user.update({ where: { id }, data, select: {name: true, email: true} })
      return updatedUser
    } catch (e) {
      if(e.code === "P2025") throw new NotFoundException("User does not exists.")
      throw e
    }
  }

  async delete(id: string){ 
     try {
      const deletedUser = await this.prismaService.user.delete({ where: { id } })
      return deletedUser
    } catch (e) {
      if(e.code === "P2025") throw new NotFoundException("User does not exists.")
      throw e
    }
  }
}
