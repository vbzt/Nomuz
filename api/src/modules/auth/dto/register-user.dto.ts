import { IsStrongPassword } from "class-validator";
import { MatchPassword } from "src/common/decorators/match-password.decorator";
import { CreateUserDTO } from "src/modules/user/dto/create-user.dto";

export class RegisterUserDTO extends CreateUserDTO{

    
    @MatchPassword()
    confirmPassword: string
    
}