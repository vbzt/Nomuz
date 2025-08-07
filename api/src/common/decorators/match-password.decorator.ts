import { registerDecorator, ValidationOptions } from "class-validator";
import { MatchPasswordValidator } from "../validators/match-passwords.validator";

export function MatchPassword(validationOptions?: ValidationOptions){ 
  return function( object: Object, propertyName: string ){ 
    registerDecorator({ 
      target: object.constructor,
      options: validationOptions, 
      constraints: [],
      propertyName,
      validator: MatchPasswordValidator
    })
  }
}