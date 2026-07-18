import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'identity', name: 'role_menu_permission_audit_log' })
export class RoleMenuPermissionAuditLog {

  @PrimaryGeneratedColumn('uuid')
  audit_id: string;

  @Column('uuid')
  permission_id: string;

  @Column({ length: 20 })
  action_type: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ type: 'jsonb', nullable: true })
  old_data: any;

  @Column({ type: 'jsonb', nullable: true })
  new_data: any;

  @Column('uuid', { nullable: true })
  changed_by: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  changed_at: Date;

  @Column({ type: 'inet', nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  platform: string | null;
}
