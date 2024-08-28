import { Controller, Get, Inject, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from '../redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Inject()
  private readonly redisService: RedisService;

  @Get('code')
  async sendCode(@Query('address') address) {
    const code = Math.random().toString().slice(2, 8);
    await this.emailService.sendMail({
      to: address,
      subject: 'workflow 验证码',
      html: `<h1>验证码</h1><p>您的验证码是：${code}</p>`,
    });

    await this.redisService.set(`captcha_${address}`, code, 60);

    return '发送成功';
  }
}
