import { PartialType } from "@nestjs/mapped-types";
import { CreateCommitmentDTO } from "./create-commitment.dto";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { COMMITMENT_STATUS } from "@prisma/client";


export class EditCommitmentDTO extends PartialType(CreateCommitmentDTO){ 
  @IsOptional()
  @IsString()
  @IsEnum(COMMITMENT_STATUS)
  status: COMMITMENT_STATUS
}