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
import { CloudfunctionsService } from './cloudfunctions.service';
import { CreateCloudfunctionDto } from './dto/create-cloudfunction.dto';
import { UpdateCloudfunctionDto } from './dto/update-cloudfunction.dto';
import { RequireLogin, UserInfo } from '../common/custom.decorator';
import { LoginGuard } from '../common/login.guard';

@RequireLogin()
@UseGuards(LoginGuard)
@Controller('cloudfunctions')
export class CloudfunctionsController {
  constructor(private readonly cloudfunctionsService: CloudfunctionsService) {}

  @Post()
  create(
    @Body() createCloudfunctionDto: CreateCloudfunctionDto,
    @UserInfo('id') userId: number,
  ) {
    return this.cloudfunctionsService.create(createCloudfunctionDto, userId);
  }

  @Get()
  findAll(@UserInfo('id') userId: number) {
    return this.cloudfunctionsService.findAll(userId);
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.cloudfunctionsService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid') uid: string,
    @Body() updateCloudfunctionDto: UpdateCloudfunctionDto,
  ) {
    return this.cloudfunctionsService.update(uid, updateCloudfunctionDto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.cloudfunctionsService.remove(uid);
  }
}
