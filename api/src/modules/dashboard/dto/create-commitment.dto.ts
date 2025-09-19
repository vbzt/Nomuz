import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export class CreateCommitmentDTO{ 
  
  @IsString()
  @MinLength(6)
  title: string

  @Type (() => Date)
  @IsDate()
  dueDate: Date

  @IsEmail()
  email: string
}