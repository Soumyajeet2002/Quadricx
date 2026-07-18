import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),      
        //   port: config.get<number>('MAIL_PORT'),      
          port: 465,       // 587
          secure: true,    // false for port 587 (STARTTLS)
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false, // ⚠️ Dev only — set to true in production
          },
        },
        defaults: {
          from: `"Support Team" <${config.get('MAIL_USER')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}