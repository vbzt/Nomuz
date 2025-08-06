import { IsEmail, IsString } from "class-validator";

export class ResetPasswordEmailDTO{ 

  @IsEmail()
  email: string

  @IsString()
  token: string

}