import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CustomerStatus } from '../entities/customer.entity';

export class GetCustomersDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: '1',
    default: '1',
  })
  @IsOptional()
  @IsString()
  page: string = '1';

  @ApiPropertyOptional({
    description: 'Number of records to return per page.',
    example: '10',
    default: '10',
  })
  @IsOptional()
  @IsString()
  limit: string = '10';

  @ApiPropertyOptional({
    description: 'Search by customer code, full name, email, or phone.',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter customers by status.',
    enum: CustomerStatus,
    example: CustomerStatus.ACTIVE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ApiPropertyOptional({
    description: 'Field used for sorting.',
    enum: ['createdAt', 'fullName', 'customerCode'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'fullName', 'customerCode'])
  sortBy = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sorting order.',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
