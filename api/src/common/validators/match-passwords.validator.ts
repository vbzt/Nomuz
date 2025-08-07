import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint( { name: "MatchPassword", async: false})
export class MatchPasswordValidator implements ValidatorConstraintInterface{ 
  validate(confirmPassword: string, args: ValidationArguments): Promise<boolean> | boolean {
    const object = args.object as any
    return confirmPassword === object.password
  }

  defaultMessage(args: ValidationArguments): string {
    return 'As senhas não coincidem'
  }
}