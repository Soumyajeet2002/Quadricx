import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { CustomerStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Full name of the customer.',
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 150)
  fullName!: string;

  @ApiPropertyOptional({
    description: 'Primary email address used for communication and login.',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @ApiPropertyOptional({
    description: 'Primary mobile number of the customer.',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Optional reference to IAM user when the customer has portal login access.',
    example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Current customer status.',
    enum: CustomerStatus,
    example: CustomerStatus.ACTIVE,
    default: CustomerStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}
