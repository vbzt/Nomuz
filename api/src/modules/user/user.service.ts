import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor (private readonly prismaService: PrismaService){}

  async create( data: CreateUserDTO ){
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash( data.password, salt )
    return this.prismaService.user.create( { data } )
  }

  async read(){ 
    return this.prismaService.user.findMany()
  }

  async readOne(id: string){ 
    const user = await this.prismaService.user.findFirst( { where: { id }, omit: { password: true } } )
    return user
  }

  async update(data: UpdateUserDTO, id: string){ 
    if(data.password){ 
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash( data.password, salt )
    }

    const updatedUser = await this.prismaService.user.update({ where: { id }, data, select: {name: true, email: true} })
    return updatedUser
  }

  async delete(id: string){ 
    const deletedUser = await this.prismaService.user.delete( { where: { id } } )
    return deletedUser  
  }
}
