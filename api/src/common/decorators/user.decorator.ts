import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((args: string, context: ExecutionContext) => { 
  const request = context.switchToHttp().getRequest()
  const userData = request.userData
  if(!userData) throw new NotFoundException("User not found.")
  if(args) return userData[args]
  return userData
})