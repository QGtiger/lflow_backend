import { Injectable } from '@nestjs/common';
import { CreateCloudfunctionDto } from './dto/create-cloudfunction.dto';
import { UpdateCloudfunctionDto } from './dto/update-cloudfunction.dto';
import { Cloudfunction } from './entities/cloudfunction.entity';
import { v4 as uuidV4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

function convertParentUid<T extends { parent_uid?: string }>(data: T): T {
  return {
    ...data,
    parent_uid: data.parent_uid === 'root' ? null : data.parent_uid,
  };
}

@Injectable()
export class CloudfunctionsService {
  @InjectRepository(Cloudfunction)
  private readonly cloudfunctionRepository: Repository<Cloudfunction>;

  async create(createCloudfunctionDto: CreateCloudfunctionDto, userId: number) {
    const { parentUid } = createCloudfunctionDto;
    if (parentUid && parentUid !== 'root') {
      const parentFolder = await this.cloudfunctionRepository.findOneBy({
        uid: parentUid,
      });
      if (!parentFolder) {
        throw new Error('父级目录不存在');
      }
    }
    const cloudfunction = new Cloudfunction();
    Object.assign(cloudfunction, createCloudfunctionDto);
    cloudfunction.uid = uuidV4();
    cloudfunction.userId = userId;

    return this.cloudfunctionRepository.save(cloudfunction);
  }

  async findAll(userId: number) {
    const list: Cloudfunction[] = await this.cloudfunctionRepository
      .createQueryBuilder('cf')
      .select('*')
      .where('cf.userId = :userId', { userId })
      .getRawMany();

    return list.map((item) => {
      return {
        ...item,
        created_at: item.createTime?.getTime(),
        updated_at: item.updateTime?.getTime(),
      };
    });
  }

  findOne(uid: string) {
    return this.cloudfunctionRepository.findOneBy({ uid });
  }

  checkIsOwner(uid: string, userId: number) {
    const item = this.cloudfunctionRepository.findOneBy({ uid, userId });
    if (!item) {
      throw new Error('无权限操作');
    }
  }

  update(uid: string, updateCloudfunctionDto: UpdateCloudfunctionDto) {
    return this.cloudfunctionRepository.update(
      {
        uid: uid,
      },
      updateCloudfunctionDto,
    );
  }

  remove(uid: string) {
    return this.cloudfunctionRepository.delete({ uid });
  }
}
