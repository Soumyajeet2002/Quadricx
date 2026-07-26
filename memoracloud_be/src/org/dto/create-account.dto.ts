// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsEnum,
//   IsNumberString,
//   IsOptional,
//   IsString,
//   IsUUID,
//   IsUrl,
//   Length,
// } from 'class-validator';
// import { AccountStatus } from '../entities/org.entities';

// export class CreateAccountDto {
//   @ApiProperty({
//     description: 'Business account type.',
//     example: 'STUDIO',
//   })
//   @IsString()
//   @Length(1, 30)
//   accountType!: string;

//   @ApiProperty({
//     description: 'Display name of the business.',
//     example: 'PixelCraft Studio',
//   })
//   @IsString()
//   @Length(1, 255)
//   accountName!: string;

//   @ApiProperty({
//     description: 'Primary owner user UUID.',
//     example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
//   })
//   @IsUUID()
//   ownerUserId!: string;

//   @ApiPropertyOptional({
//     description: 'Registered legal business name.',
//     example: 'PixelCraft Studios Private Limited',
//   })
//   @IsOptional()
//   @IsString()
//   @Length(1, 255)
//   legalName?: string;

//   @ApiPropertyOptional({
//     description: 'GST registration number.',
//     example: '21ABCDE1234F1Z5',
//   })
//   @IsOptional()
//   @IsString()
//   @Length(1, 30)
//   gstNumber?: string;

//   @ApiPropertyOptional({
//     description: 'Official business email address.',
//     example: 'hello@pixelcraft.in',
//   })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiPropertyOptional({
//     description: 'Official business contact number.',
//     example: '+919876543210',
//   })
//   @IsOptional()
//   @IsString()
//   @Length(1, 20)
//   phone?: string;

//   @ApiPropertyOptional({
//     description: 'Official business website URL.',
//     example: 'https://www.pixelcraft.in',
//   })
//   @IsOptional()
//   @IsUrl()
//   website?: string;

//   @ApiPropertyOptional({
//     description: 'Current account status.',
//     enum: AccountStatus,
//     example: AccountStatus.ACTIVE,
//     default: AccountStatus.ACTIVE,
//   })
//   @IsOptional()
//   @IsEnum(AccountStatus)
//   status?: AccountStatus;

//   @ApiPropertyOptional({
//     description: 'Initial onboarding fee.',
//     example: '5000.00',
//   })
//   @IsOptional()
//   @IsNumberString()
//   onboardingFee?: string;

//   @ApiPropertyOptional({
//     description: 'Default commission percentage.',
//     example: '10.00',
//   })
//   @IsOptional()
//   @IsNumberString()
//   commissionPercentage?: string;
// }

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus } from '../entities/org.entities';
import { AccountMemberRole } from '../entities/AccountMember.entities';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Unique branch code within the account.',
    example: 'HO001',
  })
  @IsString()
  @Length(1, 20)
  branchCode!: string;

  @ApiProperty({
    description: 'Branch name.',
    example: 'Head Office',
  })
  @IsString()
  @Length(1, 255)
  branchName!: string;

  @ApiPropertyOptional({
    example: 'Bhubaneswar',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'Odisha',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: 'India',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'Plot 101, Infocity Road',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+91-9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'branch@pixelcraft.in',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Marks this branch as the Head Office.',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isHeadOffice?: boolean;
}

export class CreateAccountDto {
  @ApiProperty({
    description: 'Business account type.',
    example: 'STUDIO',
  })
  @IsString()
  @Length(1, 30)
  accountType!: string;

  @ApiProperty({
    description: 'Display name of the business.',
    example: 'PixelCraft Studio',
  })
  @IsString()
  @Length(1, 255)
  accountName!: string;

  @ApiProperty({
    description: 'Primary owner user UUID.',
    example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
  })
  @IsUUID()
  ownerUserId!: string;

  @ApiPropertyOptional({
    example: 'PixelCraft Studios Private Limited',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  legalName?: string;

  @ApiPropertyOptional({
    example: '21ABCDE1234F1Z5',
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  gstNumber?: string;

  @ApiPropertyOptional({
    example: 'hello@pixelcraft.in',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+91-9876543210',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://www.pixelcraft.in',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({
    example: '5000.00',
  })
  @IsOptional()
  @IsNumberString()
  onboardingFee?: string;

  @ApiPropertyOptional({
    example: '10.00',
  })
  @IsOptional()
  @IsNumberString()
  commissionPercentage?: string;

  // ==========================
  // Owner Member
  // ==========================

  @ApiPropertyOptional({
    enum: AccountMemberRole,
    default: AccountMemberRole.OWNER,
  })
  @IsOptional()
  @IsEnum(AccountMemberRole)
  roleCode?: AccountMemberRole;

  @ApiPropertyOptional({
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  // ==========================
  // Head Office Branch
  // ==========================

  @ApiProperty({
    type: CreateBranchDto,
    description: 'Head Office branch details.',
  })
  @ValidateNested()
  @Type(() => CreateBranchDto)
  branch!: CreateBranchDto;
}
