import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IpaasService } from './ipaas.service';
import { CreateIpaasConnectorDto } from './dto/create-ipaasconnector.dto';
import { UpdateIpaasDto } from './dto/update-ipaas.dto';
import { RequireLogin, UserInfo } from 'src/common/custom.decorator';
import { LoginGuard } from 'src/common/login.guard';

@RequireLogin()
@UseGuards(LoginGuard)
@Controller('ipaas/connector')
export class IpaasController {
  constructor(private readonly ipaasService: IpaasService) {}

  @Post()
  create(
    @Body() createIpaaDto: CreateIpaasConnectorDto,
    @UserInfo('id') userId: number,
  ) {
    return this.ipaasService.create(createIpaaDto, userId);
  }

  @Get()
  findAll(@UserInfo('id') userId: number) {
    return this.ipaasService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @UserInfo('id') userId: number) {
    return this.ipaasService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIpaaDto: UpdateIpaasDto,
    @UserInfo('id') userId: number,
  ) {
    return this.ipaasService.update(+id, updateIpaaDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipaasService.remove(+id);
  }

  @Post(':id/publish')
  publish(
    @Body() pubData: { note: string },
    @Param('id') id: string,
    @UserInfo('id') userId: number,
  ) {
    return this.ipaasService.publish(pubData, +id, userId);
  }

  @Get(':id/publish')
  getPublish(@Param('id') id: string, @UserInfo('id') userId: number) {
    return this.ipaasService.queryPublishList(+id, userId);
  }
}
