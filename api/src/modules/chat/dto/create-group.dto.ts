import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from "class-validator";


export class CreateGroupDTO{
  @IsOptional() 
  @IsString()
  name: string

}