import { Injectable } from '@nestjs/common';
import { CreateIpaasConnectorDto } from './dto/create-ipaasconnector.dto';
import { UpdateIpaasDto } from './dto/update-ipaas.dto';
import { IpaasConnector } from './entities/ipaas-connector.entity';
import { v4 } from 'uuid';
import { IpaasConnectorVersion } from './entities/ipaas-connector-version.entity';
import { simpleParse } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/users.entity';
import { IpaasAction, IpaasAuthProtocel } from './entities/type';
import { PublishIpaasConnectorDto } from './dto/publish-ipaas.dto';

@Injectable()
export class IpaasService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @InjectRepository(IpaasConnector)
  private readonly ipaasConnectorRepository: Repository<IpaasConnector>;

  @InjectRepository(IpaasConnectorVersion)
  private readonly ipaasConnectorVersionRepository: Repository<IpaasConnectorVersion>;

  async create(createIpaaDto: CreateIpaasConnectorDto, userId: number) {
    const initVersion = 1;
    const connectorCode = `connector-${v4()}`;

    const ipaasConnector = new IpaasConnector();
    ipaasConnector.code = connectorCode;
    ipaasConnector.userId = userId;
    ipaasConnector.connectorVersion = initVersion;
    const savedConnector = await this.ipaasConnectorRepository.save(
      ipaasConnector,
    );

    const connectorVersion = new IpaasConnectorVersion();
    connectorVersion.version = initVersion;
    connectorVersion.connectorId = savedConnector.id;
    Object.assign(connectorVersion, createIpaaDto);

    await this.ipaasConnectorVersionRepository.save(connectorVersion);
    return {
      connectorCode,
    };
  }

  async findAll(userId: number) {
    const list = await this.ipaasConnectorRepository
      .createQueryBuilder('ic')
      .leftJoin(IpaasConnectorVersion, 'icv', 'icv.connectorId = ic.id')
      .select('ic.id', 'id')
      .addSelect('ic.code', 'code')
      .addSelect('icv.name', 'name')
      .addSelect('ic.createTime', 'createTime')
      .addSelect('ic.updateTime', 'updateTime')
      .addSelect('icv.description', 'description')
      .addSelect('icv.version', 'version')
      .addSelect('icv.logo', 'logo')
      .addSelect('icv.isPublished', 'isPublished')
      .where('ic.userId = :userId', { userId })
      .andWhere('ic.connectorVersion = icv.version')
      .getRawMany();
    return list.map((it) => {
      return {
        ...it,
        createTime: it.createTime.getTime(),
        updateTime: it.updateTime.getTime(),
        isPublished: !!it.isPublished,
      };
    });
  }

  async findOne(
    code: string,
    userId: number,
  ): Promise<{
    id: number;
    code: string;
    name: string;
    createTime: number;
    updateTime: number;
    description: string;
    version: number;
    logo: string;
    isPublished: boolean;
    actions: IpaasAction[];
    authProtocol: IpaasAuthProtocel;
  }> {
    const data = await this.ipaasConnectorRepository
      .createQueryBuilder('ic')
      .leftJoin(IpaasConnectorVersion, 'icv', 'icv.connectorId = ic.id')
      .select('ic.id', 'id')
      .addSelect('ic.code', 'code')
      .addSelect('icv.name', 'name')
      .addSelect('ic.createTime', 'createTime')
      .addSelect('ic.updateTime', 'updateTime')
      .addSelect('icv.description', 'description')
      .addSelect('icv.version', 'version')
      .addSelect('icv.logo', 'logo')
      .addSelect('icv.isPublished', 'isPublished')
      .addSelect('icv.authProtocol', 'authProtocol')
      .addSelect('icv.actions', 'actions')
      .where('ic.userId = :userId', { userId })
      .andWhere('ic.connectorVersion = icv.version')
      .andWhere('ic.code = :code', { code })
      .getRawOne();

    if (!data) {
      throw new Error('未查询到该连接器');
    }
    return {
      ...data,
      createTime: data.createTime.getTime(),
      updateTime: data.updateTime.getTime(),
      actions: simpleParse(data.actions, []),
      authProtocol: simpleParse(data.authProtocol),
      isPublished: !!data.isPublished,
    };
  }

  async update(id: number, updateIpaaDto: UpdateIpaasDto, userId: number) {
    const connectorVersion = await this.queryConnectorVersion(id, userId);
    const {
      isPublished,
      actions,
      version,
      authProtocol,
      id: versionId,
    } = connectorVersion;
    if (isPublished) {
      // 如果修改已发布版本，就先拷贝一份已发布快照版本，版本+1
      const newConnectorVersion = new IpaasConnectorVersion();
      Object.assign(newConnectorVersion, {
        ...connectorVersion,
        ...updateIpaaDto,
        version: version + 1,
        isPublished: false,
        actions: updateIpaaDto.actions
          ? JSON.stringify(updateIpaaDto.actions)
          : actions,
        authProtocol: updateIpaaDto.authProtocol
          ? JSON.stringify(updateIpaaDto.authProtocol)
          : authProtocol,
      });

      const connector = await this.ipaasConnectorRepository.findOne({
        where: {
          id,
        },
      });
      newConnectorVersion.connectorId = connector.id;
      // 防止走更新
      delete newConnectorVersion.id;
      // 保存新版本
      await this.ipaasConnectorVersionRepository.save(newConnectorVersion);

      // 更新连接器版本
      connector.connectorVersion = newConnectorVersion.version;
      await this.ipaasConnectorRepository.save(connector);
      return '更新成功，已发布版本已拷贝';
    } else {
      await this.ipaasConnectorVersionRepository.update(versionId, {
        ...updateIpaaDto,
        actions: updateIpaaDto.actions
          ? JSON.stringify(updateIpaaDto.actions)
          : actions,
        authProtocol: updateIpaaDto.authProtocol
          ? JSON.stringify(updateIpaaDto.authProtocol)
          : authProtocol,
      });
      return '更新成功';
    }
  }

  remove(id: number) {
    return Promise.all([
      this.ipaasConnectorRepository.delete(id),
      this.ipaasConnectorVersionRepository.delete({
        connectorId: id,
      }),
    ]);
  }

  async queryConnectorVersion(
    id: number,
    userId: number,
  ): Promise<IpaasConnectorVersion> {
    const connector = await this.ipaasConnectorRepository.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!connector) {
      throw new Error('未查询到该连接器');
    }
    return await this.ipaasConnectorVersionRepository
      .createQueryBuilder('icv')
      .select('*')
      .where('icv.connectorId = :id', { id })
      .andWhere('icv.version = :version', {
        version: connector.connectorVersion,
      })
      .getRawOne();
  }

  async publish(pubData: PublishIpaasConnectorDto, id: number, userId: number) {
    const connectorVersion = await this.queryConnectorVersion(id, userId);
    if (connectorVersion.isPublished) {
      throw new Error('不能发布已发布的连接器');
    }
    connectorVersion.isPublished = true;
    connectorVersion.pubNote = pubData.pubNote;
    await this.ipaasConnectorVersionRepository.save(connectorVersion);
    return '发布成功';
  }

  async queryPublishList(id: number, userId: number) {
    const list = await this.ipaasConnectorVersionRepository
      .createQueryBuilder('icv')
      .leftJoin(IpaasConnector, 'ic', 'ic.id = icv.connectorId')
      .leftJoin(User, 'u', 'u.id = ic.userId')
      .select('icv.version', 'version')
      .addSelect('icv.pubNote', 'pubNote')
      .addSelect('icv.updateTime', 'pubTime')
      .where('icv.connectorId = :id', { id })
      .andWhere('icv.isPublished = true')
      .andWhere('ic.userId = :userId', { userId })
      .getRawMany();
    return list.map((it) => {
      return {
        ...it,
        pubTime: it.pubTime.getTime(),
      };
    });
  }
}
