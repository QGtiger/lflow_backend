import { IsAlpha, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsAlpha('en-US', {
    message: '用户名只能包含字母',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
