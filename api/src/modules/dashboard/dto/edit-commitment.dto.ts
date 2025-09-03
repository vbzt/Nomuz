import { PartialType } from "@nestjs/mapped-types";
import { CreateCommitmentDTO } from "./create-commitment.dto";
import { IsEmail, IsOptional } from "class-validator";


export class EditCommitmentDTO extends PartialType(CreateCommitmentDTO){ 
}