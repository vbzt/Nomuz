import { Transform } from "class-transformer"
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, Min } from "class-validator"
import { ROLE } from "src/common/enums/user-role.enum"



export class CreateUserDTO{ 
  @IsString()
  name: string

  @IsEmail({}, { message: "Formato de e-mail inválido"})
  email: string
  
@IsStrongPassword(
  {
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  },
  { message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.' },
)
  password: string
  
  @IsOptional()
  @IsString()
  lawyerRegistration: string
}