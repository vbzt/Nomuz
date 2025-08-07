import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { MatchPassword } from "src/common/decorators/match-password.decorator";

export class ResetPasswordDTO { 

  @IsEmail()
  email: string 

  @IsString() 
  token: string 

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  password: string
  

  @IsString()
  @MatchPassword()
  confirmPassword: string



}