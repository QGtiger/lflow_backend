import { PartialType } from '@nestjs/mapped-types';
import { CreateIpaasConnectorDto } from './create-ipaasconnector.dto';
import { IpaasAction } from '../entities/type';

export class UpdateIpaasDto extends PartialType(CreateIpaasConnectorDto) {
  actions?: IpaasAction[];
}
