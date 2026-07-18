import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';
import * as fs from 'fs';
import { join } from 'path';
import { EMAIL } from 'src/common/messages/specific.msg';
import { COMMON } from 'src/common/messages/common.msg';
@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMail(
        data: SendEmailDto
    ) {
        try {
            let { to, subject, templateName, fieldValue } = data;
            if (!to) {
                throw new BadRequestException(EMAIL.ERRORS.INVALID_ID);
            }
            let html = fs.readFileSync(
                join(process.cwd(), 'src', 'email', 'templates', templateName),
                'utf8',
            );
            Object.entries(fieldValue).forEach(([key, value]) => {
                html = html.replace(
                    new RegExp(`{{${key}}}`, 'g'),
                    String(value),
                );
            });
            await this.mailerService.sendMail({
                to,
                subject,
                html,
            });
            return {
                message: EMAIL.SUCCESS.EMAIL_SEND,
            };
        } catch (error) {
            console.error('Email Error:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                COMMON.ERRORS.INTERNAL_SERVER_ERROR,
            );
        }

    }
}