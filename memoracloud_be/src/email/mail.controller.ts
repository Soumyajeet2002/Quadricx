import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDto } from './dto/send-email.dto';


@Controller('email')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    async sendEmail(@Body() body: SendEmailDto) {
        return await this.mailService.sendMail(body);
    }
}