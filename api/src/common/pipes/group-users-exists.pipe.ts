import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'password'>

@Injectable()
export class GroupUsersExistsPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: string[] | string, metadata: ArgumentMetadata): Promise<SafeUser[]> {
    if (!value) throw new BadRequestException('Members are required')
  

    const memberIds = Array.isArray(value) ? value : [value]

    const users: SafeUser[] = []
    for (const id of memberIds) {
      const user = await this.userService.readOne(id)

      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`)
      }
      users.push(user as SafeUser)
    }

    return users;
  }
}
