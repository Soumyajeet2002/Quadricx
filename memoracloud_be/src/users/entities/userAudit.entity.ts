
// audit.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_audit_log', schema: 'identity' })
export class UserAuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' , name: 'audit_id' })
  auditId: number;

  @Column({ type: 'varchar', name: 'user_id' })
  userId: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'action_type',
  })
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({
    type: 'jsonb',
    name: 'old_data',
    nullable: true,
  })
  oldData: Record<string, any> | null;

  @Column({
    type: 'jsonb',
    name: 'new_data',
    nullable: true,
  })
  newData: Record<string, any> | null;

  @Column({
    type: 'bigint',
    name: 'changed_by',
    nullable: true,
  })
  changedBy: number | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'changed_at',
    default: () => 'NOW()',
  })
  changedAt: Date;

  @Column({
    type: 'inet',
    name: 'ip_address',
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  platform: string | null;
}
