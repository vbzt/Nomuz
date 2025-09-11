import { IsEmail } from "class-validator";


export class ForgotPasswordDTO{ 
  @IsEmail({}, { message: "Formato de e-mail inválido"})
  email: string 
}  