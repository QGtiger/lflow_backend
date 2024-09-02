import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudfunctionDto } from './create-cloudfunction.dto';

export class UpdateCloudfunctionDto extends PartialType(
  CreateCloudfunctionDto,
) {
  uid: string;
}
