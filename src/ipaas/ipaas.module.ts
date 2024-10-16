import { Module } from '@nestjs/common';
import { IpaasService } from './ipaas.service';
import { IpaasController } from './ipaas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpaasConnector } from './entities/ipaas-connector.entity';
import { IpaasConnectorVersion } from './entities/ipaas-connector-version.entity';
import { User } from 'src/user/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IpaasConnector, IpaasConnectorVersion, User]),
  ],
  controllers: [IpaasController],
  providers: [IpaasService],
})
export class IpaasModule {}
