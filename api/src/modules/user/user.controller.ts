import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { ParseCUIDPipe } from 'src/common/pipes/parse-cuid.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/common/guards/admin.guard';

@UseGuards(AuthGuard, AdminGuard)
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
  
  @UseInterceptors(FileInterceptor('file'))
  @Patch(":id")
  async update(@Body() data: UpdateUserDTO, @Param('id', ParseCUIDPipe, UserExistsPipe ) id: string, @UploadedFile() file?: Express.Multer.File){
    return this.userService.update(data, id, file)
  }

  @Delete(":id")
    async delete(@Param("id", ParseCUIDPipe, UserExistsPipe ) id: string ){
      return this.userService.delete(id)
    }




}
