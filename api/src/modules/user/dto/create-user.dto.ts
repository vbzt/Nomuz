import { Transform } from "class-transformer"
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { ROLE } from "src/common/enums/user-role.enum"



export class CreateUserDTO{ 
  
  @IsString()
  name: string

  @IsEmail()
  email: string
  
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  password: string
  
  @IsOptional()
  @IsString()
  lawyerRegistration: string
}