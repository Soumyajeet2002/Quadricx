import { PartialType } from '@nestjs/swagger';
import { CreateRoleMenuPermissionDto } from './create-role-menu-permission.dto';

export class UpdateRoleMenuPermissionDto
  extends PartialType(CreateRoleMenuPermissionDto) {}
