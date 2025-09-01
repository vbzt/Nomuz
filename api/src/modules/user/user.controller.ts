import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { ParseCUIDPipe } from 'src/common/pipes/parse-cuid.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';

@Controller('users')
export class UserController {

  constructor( private readonly userService: UserService, private readonly fileService: FileService){}
  
  @Get()
  async showAll(){ 
    return this.userService.read()
  }

  @Get(":id")
  async readOne(@Param("id", ParseCUIDPipe, UserExistsPipe) id: string ){ 
    return this.userService.readOne(id)
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(@Body() data: CreateUserDTO, @UploadedFile() file: Express.Multer.File){ 
    return this.userService.create(data, file) 
  } 

  @Patch(":id")
  async update(@Body() data: UpdateUserDTO, @Param('id', ParseCUIDPipe, UserExistsPipe ) id: string){
    return this.userService.update(data, id)
  }

  @Delete(":id")
    async delete(@Param("id", ParseCUIDPipe, UserExistsPipe ) id: string ){
      return this.userService.delete(id)
    }




}
