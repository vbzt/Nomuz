import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { MatchPassword } from "src/common/decorators/match-password.decorator";

export class ResetPasswordDTO { 

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
  

  @IsString()
  @MatchPassword()
  confirmPassword: string



}