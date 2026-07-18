import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MenuPermissionNodeDto } from './menu-permission-node.dto';

export class CreateRoleMenuPermissionDto {
  @ApiProperty({ example: '6a3c3c2e-0e77-4e91-bb9a-9fd1c2bfb001' })
  @IsUUID()
  roleUnqId: string;

  @ApiProperty({ type: [MenuPermissionNodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionNodeDto)
  menus: MenuPermissionNodeDto[];
}
