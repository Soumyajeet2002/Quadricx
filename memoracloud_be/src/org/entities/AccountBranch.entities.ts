import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatus } from './org.entities';

@Entity({ schema: 'org', name: 'branch' })
@Index('idx_branch_account', ['accountId'])
@Index('idx_branch_code', ['accountId', 'branchCode'], { unique: true })
@Index('idx_branch_city', ['city'])
@Index('idx_branch_status', ['status'])
export class BranchEntity {
  /**
   * Internal UUID primary key.
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Internal UUID primary key.',
  })
  id!: string;

  /**
   * Account reference.
   */
  @Column({
    name: 'account_id',
    type: 'uuid',
    comment: 'Reference to org.account.',
  })
  accountId!: string;

  /**
   * Unique branch code within an account.
   *
   * Example:
   * HO001
   * BR001
   */
  @Column({
    name: 'branch_code',
    type: 'varchar',
    length: 20,
    comment: 'Unique branch code within an account.',
  })
  branchCode!: string;

  /**
   * Branch display name.
   *
   * Example:
   * Head Office
   */
  @Column({
    name: 'branch_name',
    type: 'varchar',
    length: 255,
    comment: 'Branch display name.',
  })
  branchName!: string;

  /**
   * City.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city?: string;

  /**
   * State.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  state?: string;

  /**
   * Country.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  country?: string;

  /**
   * Branch address.
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  address?: string;

  /**
   * Branch phone number.
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone?: string;

  /**
   * Branch email.
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email?: string;

  /**
   * Indicates whether this is the Head Office.
   */
  @Column({
    name: 'is_head_office',
    type: 'boolean',
    default: false,
  })
  isHeadOffice!: boolean;

  /**
   * Branch status.
   */
  @Column({
    type: 'smallint',
    default: AccountStatus.ACTIVE,
  })
  status!: AccountStatus;

  /**
   * Record creation timestamp.
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  /**
   * User who created the record.
   */
  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdBy!: string;

  /**
   * Last modification timestamp.
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
  })
  updatedAt?: Date;

  /**
   * User who updated the record.
   */
  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
  })
  updatedBy?: string;
}
