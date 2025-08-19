import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';

@Controller('user')
export class UserController {

  constructor( private readonly userService: UserService){}
  
  @Get()
  async showAll(){ 
    return this.userService.read()
  }

  @Get(":id")
  async readOne(@Param("id", new ParseUUIDPipe( { version: '4' } ), UserExistsPipe) id: string ){ 
    return this.userService.readOne(id)
  }

  @Post()
  async create(@Body() data: CreateUserDTO){ 
    return this.userService.create(data)
  }

  @Patch(":id")
  async update(@Body() data: UpdateUserDTO, @Param('id', new ParseUUIDPipe( { version: '4' } ), UserExistsPipe ) id: string){
    return this.userService.update(data, id)
  }

  @Delete(":id")
    async delete(@Param("id", new ParseUUIDPipe( { version: '4' } ), UserExistsPipe ) id: string ){
      return this.userService.delete(id)
    }




}
