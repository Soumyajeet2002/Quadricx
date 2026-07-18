import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Unique code for the role',
    example: 1,
  })
  @IsNumber()
  roleCode: number;

  @ApiProperty({
    description: 'Role name (trimmed automatically)',
    example: 'Administrator',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional({
    description: 'User creating the role',
    example: 'admin-user',
    nullable: true,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Role status (0 = Inactive, 1 = Active, 2 = Deleted)',
    example: 1,
    default: 1,
    enum: [0, 1, 2],
  })
  @IsOptional()
  status?: 0 | 1 | 2;
}
