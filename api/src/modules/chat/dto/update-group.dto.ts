import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class UpdateGroupDTO  {
  
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsBoolean()
  adminOnly: boolean

}