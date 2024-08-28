import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserService {
    private postgresService;
    login(loginUserDto: LoginUserDto): Promise<LoginUserDto>;
    register(registerUserDto: RegisterUserDto): Promise<any>;
}
