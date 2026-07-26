// import { Type } from 'class-transformer';
// import {
//   IsEnum,
//   IsIn,
//   IsInt,
//   IsOptional,
//   IsString,
//   Max,
//   Min,
//   IsUUID,
// } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { AccountStatus } from '../entities/org.entities';

// export class GetAccountsDto {
//   @ApiPropertyOptional({
//     description: 'Filter by account code.',
//     example: 'STD000001',
//   })
//   @IsOptional()
//   @IsString()
//   accountCode?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by account name.',
//     example: 'PixelCraft Studio',
//   })
//   @IsOptional()
//   @IsString()
//   accountName?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by owner user UUID.',
//     example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
//   })
//   @IsOptional()
//   @IsUUID()
//   ownerUserId?: string;

//   @ApiPropertyOptional({
//     description: 'Search keyword.',
//     example: 'PixelCraft',
//   })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiPropertyOptional({
//     example: 'STUDIO',
//   })
//   @IsOptional()
//   @IsString()
//   accountType?: string;

//   @ApiPropertyOptional({
//     description: 'Page number for pagination.',
//     example: 1,
//     default: 1,
//   })
//   @IsOptional()
//   @Type(() => Number)
//   page?: number;

//   @ApiPropertyOptional({
//     description: 'Number of records per page.',
//     example: 10,
//     default: 10,
//   })
//   @IsOptional()
//   @Type(() => Number)
//   limit?: number;

//   @ApiPropertyOptional({
//     enum: AccountStatus,
//     example: AccountStatus.ACTIVE,
//   })
//   @IsOptional()
//   @Type(() => Number)
//   @IsEnum(AccountStatus)
//   status?: AccountStatus;

//   @ApiPropertyOptional({
//     enum: ['createdAt', 'accountName', 'accountCode'],
//     default: 'createdAt',
//   })
//   @IsOptional()
//   @IsIn(['createdAt', 'accountName', 'accountCode'])
//   sortBy = 'createdAt';

//   @ApiPropertyOptional({
//     enum: ['ASC', 'DESC'],
//     default: 'DESC',
//   })
//   @IsOptional()
//   @IsIn(['ASC', 'DESC'])
//   order: 'ASC' | 'DESC' = 'DESC';
// }

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus } from '../entities/org.entities';

export class GetAccountsDto {
  @ApiPropertyOptional({
    description: 'Filter by account code.',
    example: 'STD000001',
  })
  @IsOptional()
  @IsString()
  accountCode?: string;

  @ApiPropertyOptional({
    description: 'Filter by account name.',
    example: 'PixelCraft Studio',
  })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiPropertyOptional({
    description: 'Filter by account type.',
    example: 'STUDIO',
  })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiPropertyOptional({
    description: 'Filter by owner user UUID.',
    example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
  })
  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @ApiPropertyOptional({
    description: 'Filter by member user UUID.',
    example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by member role.',
    example: 'OWNER',
  })
  @IsOptional()
  @IsString()
  roleCode?: string;

  @ApiPropertyOptional({
    description: 'Filter primary account member.',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description:
      'Search by account code, account name, email, phone or member role.',
    example: 'PixelCraft',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branchCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branchName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  isHeadOffice?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by account status.',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;
  //
  @ApiPropertyOptional({
    description: 'Number of records per page.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Field to sort by.',
    enum: ['createdAt', 'accountName', 'accountCode'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'accountName', 'accountCode'])
  sortBy: 'createdAt' | 'accountName' | 'accountCode' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order.',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
