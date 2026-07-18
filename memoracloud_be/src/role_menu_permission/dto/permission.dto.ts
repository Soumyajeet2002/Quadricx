import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PermissionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canRead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canWrite?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canApprove?: boolean;
}
