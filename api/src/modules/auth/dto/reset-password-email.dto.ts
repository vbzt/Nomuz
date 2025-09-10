import { IsEmail, IsString } from "class-validator";

export class ResetPasswordEmailDTO{ 

  @IsEmail({}, { message: "Formato de e-mail inválido"})
  email: string

  @IsString()
  token: string

}