import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountMemberStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}
export enum AccountMemberRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  EDITOR = 'EDITOR',
}
@Entity({ schema: 'org', name: 'account_member' })
export class AccountMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'role_code', type: 'varchar', length: 30 })
  roleCode!: string;

  @Column({
    name: 'is_primary',
    type: 'boolean',
    default: false,
  })
  isPrimary!: boolean;

  @Column({
    name: 'joined_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt!: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdBy!: string;

  @Column({
    type: 'smallint',
    default: 1,
  })
  status!: number;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt!: Date;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
  })
  updatedBy!: string;
}
