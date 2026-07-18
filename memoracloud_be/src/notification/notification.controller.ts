import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateMessageLogDto, CreateUserDeviceDto, sendNotificationDto } from "./dto/create-user-device.dto";
import { NotificationService } from "./notification.service";

@Controller('notification')
export class NotificationController {
    constructor(
        private notificationService: NotificationService
    ) { }

    @ApiBearerAuth('access-token')
    @Post('create-device')
    async createService(@Body() data: CreateUserDeviceDto) {
        return await this.notificationService.executeByActionType(
            'createDevice',
            data
        );
    }

    @ApiBearerAuth('access-token')
    @Post('send-notification')
    async sendNotificationService(@Body() data: sendNotificationDto) {
        return await this.notificationService.executeByActionType(
            'sendNotification',
            data
        );
    }

    @ApiBearerAuth('access-token')
    @Post('find-token-and-send-notification')
    async findTokenAndSendNotificationService(@Body() data: CreateMessageLogDto) {
        return await this.notificationService.executeByActionType(
            'findTokenAndSendNotification',
            data
        );
    }
}