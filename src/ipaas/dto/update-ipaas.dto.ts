import { PartialType } from '@nestjs/mapped-types';
import { CreateIpaasConnectorDto } from './create-ipaasconnector.dto';

export class UpdateIpaasDto extends PartialType(CreateIpaasConnectorDto) {}
