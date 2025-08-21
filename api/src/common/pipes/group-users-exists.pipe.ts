import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class GroupUsersExistsPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: string | string[], _metadata?: ArgumentMetadata) {
    const ids = Array.isArray(value) ? value : [value]
    const users = await Promise.all(ids.map(id => this.userService.readOne(id)))
    if (users.some(u => !u)) throw new NotFoundException('Um ou mais usuários não existem.')
    return users
  }
}

