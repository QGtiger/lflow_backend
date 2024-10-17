import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCloudfunctionDto {
  @IsNotEmpty({
    message: '云函数名称不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '云函数描述不能为空',
  })
  description: string;

  parentUid?: string;

  @IsBoolean({
    message: 'isDir 必须是布尔值',
  })
  isDir?: boolean;
}
