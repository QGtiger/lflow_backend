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
  findOne(@Param('id') id: string) {
    return this.ipaasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIpaaDto: UpdateIpaasDto) {
    return this.ipaasService.update(+id, updateIpaaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipaasService.remove(+id);
  }
}
