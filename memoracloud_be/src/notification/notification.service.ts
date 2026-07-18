import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDeviceEntity } from "./entities/user-device.entity";
import { MessageLog } from "./entities/message-log.entity";
import { Repository } from "typeorm";
import { CreateMessageLogDto, CreateUserDeviceDto, sendNotificationDto } from "./dto/create-user-device.dto";
import { NOTIFICATION } from "src/common/messages/specific.msg";
import { COMMON } from "src/common/messages/common.msg";
import { getMessaging } from 'firebase-admin/messaging';
@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    constructor(
        @InjectRepository(UserDeviceEntity)
        private readonly userDeviceRepository: Repository<UserDeviceEntity>,
        @InjectRepository(MessageLog)
        private readonly messageLogRepository: Repository<MessageLog>
    ) { }

    executeByActionType(fn: string, ...args: any[]) {
        const methodMap: Record<string, Function> = {
            createDevice: this._createDeviceSql.bind(this),
            sendNotification: this._sendPushNotification.bind(this),
            findTokenAndSendNotification:this._getTokenAndTriggerNotification.bind(this)
        };

        const method = methodMap[fn];
        if (!method) throw new Error(`Invalid function: ${fn}`);
        return method(...args);
    }

    async _createDeviceSql(
        dto: CreateUserDeviceDto,
    ) {
        try {
            if (!dto.userId || !dto.deviceUniqueId) {
                throw new BadRequestException(NOTIFICATION.ERRORS.INVALID_ID);
            }
            const existingDevice = await this.userDeviceRepository.findOne({
                where: {
                    userId: dto.userId,
                    deviceUniqueId: dto.deviceUniqueId,
                },
            });

            if (existingDevice) {
                await this.userDeviceRepository.update(
                    {
                        deviceId: existingDevice.deviceId,
                    },
                    {
                        fcmToken: dto.fcmToken,
                        appVersion: dto.appVersion,
                        deviceName: dto.deviceName,
                        lastLoginAt: new Date(),
                        status: 1,
                        updatedAt: new Date()
                    },
                );

                const updatedDeviceData = await this.userDeviceRepository.findOneBy({
                    deviceId: existingDevice.deviceId,
                });
                return { data: updatedDeviceData, message: NOTIFICATION.SUCCESS.DEVICE_UPDATE };
            }

            const device = this.userDeviceRepository.create({
                ...dto,
                status: 1,
                lastLoginAt: new Date(),
            });

            const savedDevice = await this.userDeviceRepository.save(device);

            return { data: savedDevice, message: NOTIFICATION.SUCCESS.DEVICE_CREATE };
        } catch (error: any) {
            this.logger.error({
                error: error.message,
                stack: error.stack,
            });

            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                COMMON.ERRORS.INTERNAL_SERVER_ERROR,
            );
        }

    }

    async _getTokenAndTriggerNotification(data: CreateMessageLogDto) {
        if (!data.recipientId) {
            throw new BadRequestException(NOTIFICATION.ERRORS.INVALID_ID);
        }
        try {
            const deviceDetails = await this.userDeviceRepository
                .createQueryBuilder('t')
                .select([
                    't.fcm_token AS fcm_token',
                ])
                .where('t.user_id = :userId', {
                    userId: data.recipientId,
                })
                .andWhere('t.status = :status', {
                    status: 1,
                })
                .getRawMany();
            const tokens = deviceDetails.map(item => item.fcm_token);
            let notificationObj = { tokens: tokens, title: data.title, body: data.message }
            const notification = await this._sendPushNotification(notificationObj);

            const messageLogs = notification.data.map((item: any) =>
                this.messageLogRepository.create({
                    organizationId: data.organizationId,
                    moduleName: data.moduleName,
                    referenceId: data.referenceId,

                    recipientId: data.recipientId,
                    recipientName: data.recipientName,
                    recipientType: data.recipientType,

                    notificationType: 'PUSH',
                    title: data.title,
                    message: data.message,

                    deviceToken: item.token,
                    provider: 'Firebase',

                    status: item.status ? 'SENT' : 'FAILED',

                    providerMessageId: item.messageId,
                    errorCode: item.code,
                    errorMessage: item.status ? null : item.message,

                    sentAt: item.status ? new Date() : undefined,
                }),
            );

            await this.messageLogRepository.save(messageLogs);

            return notification;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                COMMON.ERRORS.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async _sendPushNotification(
        data: sendNotificationDto
    ) {
        try {
            let { tokens, title, body } = data;
            if (tokens.length == 0) {
                throw new BadRequestException(NOTIFICATION.ERRORS.INVALID_TOKEN);
            }
            const response = await getMessaging().sendEachForMulticast({
                tokens,
                notification: {
                    title,
                    body,
                },
            });
            const result = response.responses.map((item, index) => ({
                status: item.success,
                token: tokens[index],
                message: item.error?.message ?? NOTIFICATION.SUCCESS.NOTIFICATION_SEND,
                messageId: item.messageId ?? null,
                code: item.error?.code ?? null,
            }));

            return {
                successCount: response.successCount,
                failureCount: response.failureCount,
                data: result,
                message: NOTIFICATION.SUCCESS.NOTIFICATION_SEND
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                COMMON.ERRORS.INTERNAL_SERVER_ERROR,
            );
        }
    }
}