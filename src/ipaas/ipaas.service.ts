import { Inject, Injectable } from '@nestjs/common';
import { CreateIpaasConnectorDto } from './dto/create-ipaasconnector.dto';
import { UpdateIpaasDto } from './dto/update-ipaas.dto';
import { PostgresService } from 'src/postgres/postgres.service';
import { IpaasConnector } from './entities/ipaas-connector.entity';
import { v4 } from 'uuid';
import { IpaasConnectorVersion } from './entities/ipaas-connector-version.entity';

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
      `select ic.id, ic.code as code, u.username as creator, icv.description, icv.version, icv.name, icv.logo, icv.ispublished  from users u join ipaas_connector ic on u.id = ic.user_id join ipaas_connector_version icv on ic.id = icv.connectorid where u.id = ${userId} and ic.version = icv.version`,
    );
    return t.rows;
  }

  findOne(id: number) {
    return `This action returns a #${id} ipaa`;
  }

  update(id: number, updateIpaaDto: UpdateIpaasDto) {
    return `This action updates a #${id} ipaa`;
  }

  remove(id: number) {
    return this.postgresService.delete('ipaas_connector', { id });
  }
}
