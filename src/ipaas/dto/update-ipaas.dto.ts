import { PartialType } from '@nestjs/mapped-types';
import { CreateIpaasConnectorDto } from './create-ipaasconnector.dto';
import { IpaasAction, IpaasAuthProtocel } from '../entities/type';

export class UpdateIpaasDto extends PartialType(CreateIpaasConnectorDto) {
  actions?: IpaasAction[];
  authProtocol?: IpaasAuthProtocel;
}
