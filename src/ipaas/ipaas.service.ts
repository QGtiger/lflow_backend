import { Inject, Injectable } from '@nestjs/common';
import { CreateIpaasConnectorDto } from './dto/create-ipaasconnector.dto';
import { UpdateIpaasDto } from './dto/update-ipaas.dto';
import { PostgresService } from 'src/postgres/postgres.service';
import { IpaasConnector } from './entities/ipaas-connector.entity';
import { v4 } from 'uuid';
import { IpaasConnectorVersion } from './entities/ipaas-connector-version.entity';
import { simpleParse } from 'src/utils';

@Injectable()
export class IpaasService {
  @Inject(PostgresService)
  private readonly postgresService: PostgresService;

  async create(createIpaaDto: CreateIpaasConnectorDto, userId: number) {
    const initVersion = 1;
    const connectorCode = `connector-${v4()}`;
    const connector = await this.postgresService.create<
      ExcludeEntity<IpaasConnector>
    >('ipaas_connector', {
      code: connectorCode,
      version: initVersion,
      user_id: userId,
    });
    await this.postgresService.create<ExcludeEntity<IpaasConnectorVersion>>(
      'ipaas_connector_version',
      {
        connectorid: connector.id,
        ...createIpaaDto,
        version: initVersion,
        ispublished: false,
        authprotocel: '',
        actions: '',
      },
    );
    return {
      connectorCode,
    };
  }

  async findAll(userId: number) {
    const t = await this.postgresService.query(
      `select 
      ic.id, ic.code as code, u.username as creator, icv.description, ic.version, icv.name, icv.logo, icv.ispublished  
      from users u 
      join ipaas_connector ic on u.id = ic.user_id join ipaas_connector_version icv 
      on ic.id = icv.connectorid 
      where u.id = ${userId} and ic.version = icv.version`,
    );
    return t.rows;
  }

  async findOne(code: string, userId: number) {
    const res = await this.postgresService.query(
      `select 
        ic.id, ic.code as code, u.username as creator, icv.description, icv.version, icv.name, icv.logo, icv.ispublished, icv.authprotocel, icv.actions,
        icv.created_at, icv.updated_at
        from users u 
        join ipaas_connector ic on u.id = ic.user_id join ipaas_connector_version icv 
        on ic.id = icv.connectorid 
        where u.id = ${userId} and ic.version = icv.version and ic.code = '${code}'`,
    );
    const data = res.rows[0];
    if (!data) {
      throw new Error('未查询到连接器版本');
    }
    return {
      ...data,
      actions: simpleParse(data.actions, []),
      authprotocel: simpleParse(data.authprotocel),
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
    };
  }

  async update(id: number, updateIpaaDto: UpdateIpaasDto, userId: number) {
    const connectorVersion = await this.queryConnectorVersion(id, userId);

    const {
      ispublished,
      id: versionId,
      connectorid,
      actions,
    } = connectorVersion;
    if (ispublished) {
      // 如果修改已发布版本，就先拷贝一份已发布快照版本，版本+1
      const newConnectorVersion = {
        ...connectorVersion,
        ispublished: false,
        version: connectorVersion.version + 1,
        created_at: new Date(),
        updated_at: new Date(),
        ...updateIpaaDto,
        actions: updateIpaaDto.actions
          ? JSON.stringify(updateIpaaDto.actions)
          : actions,
      };
      delete newConnectorVersion.id;
      await this.postgresService.create(
        'ipaas_connector_version',
        newConnectorVersion,
      );
      await this.postgresService.update(
        'ipaas_connector',
        { id: connectorid },
        {
          version: newConnectorVersion.version,
        },
      );
    } else {
      // TODO 这里有点奇怪，authprotocel 传过来是 object 但是存储的不是 [Object object] 哎
      await this.postgresService.update(
        'ipaas_connector_version',
        { id: versionId },
        {
          ...updateIpaaDto,
          updated_at: new Date(),
          actions: updateIpaaDto.actions
            ? JSON.stringify(updateIpaaDto.actions)
            : actions,
        },
      );
    }
    return `This action updates a #${id} ipaas`;
  }

  remove(id: number) {
    return this.postgresService.delete('ipaas_connector', { id });
  }

  async queryConnectorVersion(connectorId: number, userId: number) {
    const connector = await this.postgresService.findOne<IpaasConnector>(
      'ipaas_connector',
      {
        id: connectorId,
        user_id: userId,
      },
    );
    if (!connector) {
      throw new Error('未查询到该连接器');
    }
    const connectorVersion =
      await this.postgresService.findOne<IpaasConnectorVersion>(
        'ipaas_connector_version',
        {
          connectorid: connectorId,
          version: connector.version,
        },
      );
    if (!connectorVersion) {
      throw new Error('未查询到该连接器版本');
    }

    return connectorVersion;
  }

  async publish(pubData: { note: string }, id: number, userId: number) {
    const connectorVersion = await this.queryConnectorVersion(id, userId);

    if (connectorVersion.ispublished) {
      throw new Error('不能发布已发布的连接器');
    }
    connectorVersion.ispublished = true;
    connectorVersion.pub_note = pubData.note;
    await this.postgresService.update(
      'ipaas_connector_version',
      { id: connectorVersion.id },
      {
        ispublished: true,
        pub_note: pubData.note,
      },
    );
    return '发布成功';
  }

  async queryPublishList(connectorId: number, userId: number) {
    const res = await this.postgresService.query(
      `select 
        icv.version, icv.pub_note, icv.updated_at as pub_time
        from users u 
        join ipaas_connector ic on u.id = ic.user_id join ipaas_connector_version icv 
        on ic.id = icv.connectorid 
        where u.id = ${userId} and ic.id = ${connectorId} and icv.ispublished = true`,
    );
    return res.rows.map((it) => {
      return {
        ...it,
        pub_time: it.pub_time.getTime(),
      };
    });
  }
}
