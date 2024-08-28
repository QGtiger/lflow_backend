import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    login(loginUserDto: LoginUserDto): Promise<LoginUserDto>;
    register(registerUserDto: RegisterUserDto): Promise<any>;
}
