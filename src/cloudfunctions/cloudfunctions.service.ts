import { Inject, Injectable } from '@nestjs/common';
import { CreateCloudfunctionDto } from './dto/create-cloudfunction.dto';
import { UpdateCloudfunctionDto } from './dto/update-cloudfunction.dto';
import { Cloudfunction } from './entities/cloudfunction.entity';
import { PostgresService } from 'src/postgres/postgres.service';
import { v4 as uuidV4 } from 'uuid';

function convertParentUid<T extends { parent_uid?: string }>(data: T): T {
  return {
    ...data,
    parent_uid: data.parent_uid === 'root' ? null : data.parent_uid,
  };
}

@Injectable()
export class CloudfunctionsService {
  @Inject(PostgresService)
  private readonly postgresService: PostgresService;

  async create(createCloudfunctionDto: CreateCloudfunctionDto, userId: number) {
    const { parent_uid, isdir = true } = convertParentUid(
      createCloudfunctionDto,
    );

    const entity: Cloudfunction = {
      parent_uid,
      isdir,
      user_id: userId,
      name: createCloudfunctionDto.name,
      description: createCloudfunctionDto.description,
      uid: uuidV4(),
    };

    const result = await this.postgresService.create('cloud_functions', entity);

    return result;
  }

  findAll(userId: number) {
    return this.postgresService.findAll('cloud_functions', { user_id: userId });
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudfunction`;
  }

  update(uid: string, updateCloudfunctionDto: UpdateCloudfunctionDto) {
    return this.postgresService.update(
      'cloud_functions',
      { uid: uid },
      convertParentUid(updateCloudfunctionDto),
    );
  }

  remove(uid: string) {
    this.postgresService.delete('cloud_functions', { uid });
  }
}
