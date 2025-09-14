import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.dto";
import { IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()  
  @IsString()   
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
  password?: string; 
}
