import { IsEmail, IsString } from "class-validator";

export class LoginDTO{ 
  @IsEmail({}, { message: "Formato de e-mail inválido"}) 
  email: string 

  @IsString()
  password: string
}