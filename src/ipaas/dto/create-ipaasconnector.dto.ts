import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateIpaasConnectorDto {
  @IsUrl(
    {
      protocols: ['http', 'https'],
    },
    {
      message: 'logo必须是一个URL',
    },
  )
  logo: string;

  @IsNotEmpty({
    message: '连接器名称不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '连接器描述不能为空',
  })
  description: string;

  documentLink?: string;
}
