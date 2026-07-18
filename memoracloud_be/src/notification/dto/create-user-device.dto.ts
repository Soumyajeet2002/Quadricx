import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class CreateUserDeviceDto {
    @ApiProperty({
        description: 'User ID',
        example: '005c7a38-56ba-4264-88d9-16ccc88f710e',
    })
    @IsUUID()
    userId!: string;

    @ApiProperty({
        description: 'Device Type',
        example: 'android',
    })
    @IsString()
    @MaxLength(20)
    deviceType!: string; // android | ios | web

    @ApiProperty({
        description: 'Device Unique Id',
        example: '123456',
    })
    @IsString()
    @MaxLength(255)
    deviceUniqueId!: string;

    @ApiProperty({
        description: 'FCM Token',
        example: 'fJd83kLmNpQrStUvWxYz:APA91bE4uN6xR8tY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM',
    })
    @IsString()
    fcmToken!: string;

    @ApiPropertyOptional({
        description: 'App Version',
        example: 'sms 1.0',
    })
    @IsOptional()
    @IsString()
    appVersion?: string;

    @ApiPropertyOptional({
        description: 'Device Name',
        example: 'moto edge 40',
    })
    @IsOptional()
    @IsString()
    deviceName?: string;
}

export class sendNotificationDto {
    @ApiProperty({
        description: 'List of FCM Tokens',
        example: [
            'fJd83kLmNpQrStUvWxYz:APA91bE4uN6xR8tY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM',
            'fJd83kLmNpQrStUvWxYz:APA91bE4uN6xR8tY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lN',
        ],
        type: [String],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    tokens!: string[];

    @ApiProperty({
        description: 'Notification title',
        example: 'Test',
    })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({
        description: 'Notification Body',
        example: 'test',
    })
    @IsString()
    @IsNotEmpty()
    body!: string;
}

export class CreateMessageLogDto {
  @ApiPropertyOptional({
    description: 'Organization ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Module name',
    example: 'Complaint',
  })
  @IsString()
  @IsOptional()
  moduleName?: string;

  @ApiPropertyOptional({
    description: 'Reference entity ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({
    description: 'Recipient ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  recipientId!: string;

  @ApiPropertyOptional({
    description: 'Recipient name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Recipient type',
    example: 'Resident',
  })
  @IsString()
  @IsOptional()
  recipientType?: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'Complaint Assigned',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your complaint has been assigned successfully.',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}