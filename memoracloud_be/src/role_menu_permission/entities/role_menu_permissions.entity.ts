import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'role_menu_permissions', schema: 'identity' })
export class RoleMenuPermissionSqlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  role_unq_id: string;

  @Column({ type: 'uuid' })
  menu_unq_id: string;

  @Column({ default: false })
  can_read: boolean;

  @Column({ default: false })
  can_write: boolean;

  @Column({ default: false })
  can_delete: boolean;

  @Column({ default: false })
  can_approve: boolean;
}
