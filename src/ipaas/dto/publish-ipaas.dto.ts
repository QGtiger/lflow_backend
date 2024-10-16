import { IsNotEmpty } from 'class-validator';

export class PublishIpaasConnectorDto {
  @IsNotEmpty({
    message: '发布说明不能为空',
  })
  pubNote: string;
}
