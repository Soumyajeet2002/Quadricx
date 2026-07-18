import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from './permission.dto';

export class MenuPermissionNodeDto {
  @ApiProperty({ example: 'a3c2f9d0-1234-4cde-bbbb-123456789abc' })
  @IsUUID()
  menuUnqId: string;

  @ApiProperty({ type: PermissionDto })
  @ValidateNested()
  @Type(() => PermissionDto)
  permissions: PermissionDto;

  @ApiPropertyOptional({ type: [MenuPermissionNodeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionNodeDto)
  children?: MenuPermissionNodeDto[];
}
