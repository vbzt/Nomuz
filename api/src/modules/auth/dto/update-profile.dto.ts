import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfile {
  @IsOptional()
  @IsString()
  name: string

  
  @IsOptional()
  @IsEmail()
  email: string
}