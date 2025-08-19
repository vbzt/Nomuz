import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const UserData = createParamDecorator((args: string, context: ExecutionContext) => { 
  const request = context.switchToHttp().getRequest()
  const userData = request.userData
  if(!userData) throw new NotFoundException("Este usuário não existe.")
  if(args) return userData[args]
  return userData
})