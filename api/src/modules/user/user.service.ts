import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { env } from 'src/common/utils/env';

@Injectable()
export class UserService {
  constructor (private readonly prismaService: PrismaService){}

  async create(data: CreateUserDTO){ 
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)
    return this.prismaService.user.create({ data })
  }



  checkAdminAcc = ({ email, role }: CreateUserDTO) => { 
    if(email === env('ADMIN_ACC')) return true
    return false
  }
}
