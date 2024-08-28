import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    private readonly redisService;
    sendCode(address: any): Promise<string>;
}
