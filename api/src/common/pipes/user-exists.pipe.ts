import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor( private readonly userService: UserService){}
  async transform(identifier: string, metadata: ArgumentMetadata) {
    const user = await this.userService.readOne(identifier)
    if(!user) throw new NotFoundException("Este usuário não existe.")
    return user
  }
}
