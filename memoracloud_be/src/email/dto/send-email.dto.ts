import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  to!: string;

  @ApiProperty({
    example: 'Test Email',
  })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({
    example: 'society-registered.html',
  })
  @IsString()
  @IsNotEmpty()
  templateName!: string;

  @ApiProperty({
    example: {
      societyCode:'GVR-001',
      societyName: 'Green Vally',
      location: 'Bhubaneswar',
      registrationDate: '22-06-2026'
    },
  })
  @IsObject()
  fieldValue!: Record<string, any>;
}