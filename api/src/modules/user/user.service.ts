import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDTO } from './dto/update-user.dto';
import { FileService } from '../file/file.service';
import { defaultProfilePicture } from 'src/common/constants/profile-picture';

@Injectable()
export class UserService {
  constructor (private readonly prismaService: PrismaService, private readonly fileService: FileService){}

  async create( data: CreateUserDTO, file?: Express.Multer.File ){
    let profilePicture
    if(file){ 
      profilePicture = await this.fileService.upload(file)
    }else{
      profilePicture = defaultProfilePicture
    }

    
    const salt = await bcrypt.genSalt() 
    data.password = await bcrypt.hash( data.password, salt )
    const user = await this.prismaService.user.create( { data: { ...data, profilePicture } } )
    return { user }
  }

  async read(){ 
    return this.prismaService.user.findMany( { omit: { password: true } } )
  }

  async readOne(id: string){ 
    const user = await this.prismaService.user.findUnique( { where: { id }, omit: { password: true } } )
    return user
  }

  async update(data: UpdateUserDTO, id: string, file?: Express.Multer.File){ 
    let profilePicture
    if(file){ 
      profilePicture = await this.fileService.upload(file)
    } 
    if(data.password){ 
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash( data.password, salt )
    }

    const updatedUser = await this.prismaService.user.update({ where: { id }, data: { ...data, profilePicture: profilePicture }, select: {name: true, email: true} })
    return updatedUser
  }

  async delete(id: string){ 
    const deletedUser = await this.prismaService.user.delete( { where: { id } , omit: { password: true }} )
    return deletedUser  
  }
}
