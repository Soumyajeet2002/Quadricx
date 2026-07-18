import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuditLog } from '../entities/userAudit.entity';


export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

@Injectable()
export class UserAuditService {
  constructor(
    @InjectRepository(UserAuditLog)
    private readonly auditRepo: Repository<UserAuditLog>,
  ) {}

  async logUserAction(params: {
    userId: string;
    action: AuditAction;
    oldData?: any;
    newData?: any;
    changedBy?: number;
    ipAddress?: string;
    platform?: string;
  }): Promise<UserAuditLog> {
    const audit = this.auditRepo.create({
      userId: params.userId,
      actionType: params.action,

      oldData: params.oldData ?? null,
      newData: params.newData ?? null,

      changedBy: params.changedBy ?? null,
      ipAddress: params.ipAddress ?? null,
      platform: params.platform ?? null,
    });

    return this.auditRepo.save(audit);
  }
}
