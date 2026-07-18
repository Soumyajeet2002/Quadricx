import { Module } from '@nestjs/common';
import { UserDeviceEntity } from "./entities/user-device.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MessageLog } from './entities/message-log.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserDeviceEntity,MessageLog]),
    ],
    exports: [
    TypeOrmModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}