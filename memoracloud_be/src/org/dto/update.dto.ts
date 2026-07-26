// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsEnum,
//   IsNumberString,
//   IsOptional,
//   IsString,
//   IsUrl,
//   IsUUID,
//   Length,
// } from 'class-validator';
// import { AccountStatus } from '../entities/org.entities';

// export class UpdateAccountDto {
//   @ApiPropertyOptional({ example: 'STUDIO' })
//   @IsOptional()
//   @IsString()
//   @Length(1, 30)
//   accountType?: string;

//   @ApiPropertyOptional({ example: 'PixelCraft Studio' })
//   @IsOptional()
//   @IsString()
//   @Length(1, 255)
//   accountName?: string;

//   @ApiPropertyOptional({
//     example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
//   })
//   @IsOptional()
//   @IsUUID()
//   ownerUserId?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   legalName?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   gstNumber?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   phone?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUrl()
//   website?: string;

//   @ApiPropertyOptional({
//     enum: AccountStatus,
//   })
//   @IsOptional()
//   @IsEnum(AccountStatus)
//   status?: AccountStatus;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNumberString()
//   onboardingFee?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNumberString()
//   commissionPercentage?: string;
// }
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { AccountStatus } from '../entities/org.entities';
import { AccountMemberRole } from '../entities/AccountMember.entities';

export class UpdateBranchDto {
  @ApiPropertyOptional({
    description: 'Unique branch code.',
    example: 'HO001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  branchCode?: string;

  @ApiPropertyOptional({
    description: 'Branch name.',
    example: 'Head Office',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  branchName?: string;

  @ApiPropertyOptional({
    description: 'City.',
    example: 'Bhubaneswar',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State.',
    example: 'Odisha',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Country.',
    example: 'India',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Branch address.',
    example: 'Plot 101, Infocity Road',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Branch contact number.',
    example: '+91-9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Branch email.',
    example: 'branch@pixelcraft.in',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Whether this is the Head Office.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isHeadOffice?: boolean;
}

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Business account type.',
    example: 'STUDIO',
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  accountType?: string;

  @ApiPropertyOptional({
    description: 'Display name of the business.',
    example: 'PixelCraft Studio',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  accountName?: string;

  @ApiPropertyOptional({
    description: 'Primary owner user UUID.',
    example: '8b2391da-2b84-41dc-91f4-efc3a84bc912',
  })
  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @ApiPropertyOptional({
    description: 'Registered legal business name.',
    example: 'PixelCraft Studios Private Limited',
  })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({
    description: 'GST registration number.',
    example: '21ABCDE1234F1Z5',
  })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({
    description: 'Official business email.',
    example: 'hello@pixelcraft.in',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Official business phone number.',
    example: '+91-9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Official business website.',
    example: 'https://www.pixelcraft.in',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Account status.',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({
    description: 'Initial onboarding fee.',
    example: '5000.00',
  })
  @IsOptional()
  @IsNumberString()
  onboardingFee?: string;

  @ApiPropertyOptional({
    description: 'Default commission percentage.',
    example: '10.00',
  })
  @IsOptional()
  @IsNumberString()
  commissionPercentage?: string;

  // ==========================
  // Account Member
  // ==========================

  @ApiPropertyOptional({
    description: 'Role assigned to the account member.',
    enum: AccountMemberRole,
    example: AccountMemberRole.OWNER,
  })
  @IsOptional()
  @IsEnum(AccountMemberRole)
  roleCode?: AccountMemberRole;

  @ApiPropertyOptional({
    description: 'Whether the member is the primary contact.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  // ==========================
  // Branch Details
  // ==========================

  @ApiPropertyOptional({
    description: 'Head Office branch details.',
    type: UpdateBranchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBranchDto)
  branch?: UpdateBranchDto;
}
