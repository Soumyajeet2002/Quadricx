import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleMenuPermissionAuditLog } from "../entities/role_menu_permissions_audit.entity";


export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

@Injectable()
export class LogRoleMenuPermissionService {
  constructor(
    @InjectRepository(RoleMenuPermissionAuditLog)
    private readonly roleMenuPermissionAuditRepo: Repository<RoleMenuPermissionAuditLog>,
  ) {}

async logRoleMenuPermissionAction(data: {
  permissionId: string;

  action: 'CREATE' | 'UPDATE' | 'DELETE';

  oldData?: any;
  newData?: any;

  changedBy?: string;
  ipAddress?: string;
  platform?: string;
}) {
  await this.roleMenuPermissionAuditRepo.insert({
    permission_id: data.permissionId,

    action_type: data.action,

    old_data: data.oldData || null,
    new_data: data.newData || null,

    changed_by: data.changedBy || null,
    ip_address: data.ipAddress || null,
    platform: data.platform || null
  });
}

}