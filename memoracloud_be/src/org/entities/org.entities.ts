import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

@Entity({ schema: 'org', name: 'account' })
@Index('idx_account_code', ['accountCode'], { unique: true })
@Index('idx_account_type', ['accountType'])
@Index('idx_account_owner', ['ownerUserId'])
@Index('idx_account_status', ['status'])
@Index('idx_account_created', ['createdAt'])
export class AccountEntity {
  /**
   * Internal UUID primary key used for relationships and APIs.
   *
   * Example:
   * 8c6a2f6d-0f54-47e5-9c53-5d0b8d9d9d14
   */

  @PrimaryGeneratedColumn('uuid', {
    comment: 'Internal UUID primary key used for relationships and APIs.',
  })
  id!: string;

  /**
   * Human-readable unique account identifier.
   *
   * Example:
   * STD000001
   * FRL000145
   * PRT000012
   */
  @Column({
    name: 'account_code',
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Human-readable unique account identifier such as STD000001.',
  })
  accountCode!: string;

  /**
   * Business account type.
   *
   * Allowed Values:
   * - STUDIO
   * - FREELANCER
   * - PRINT_PARTNER
   *
   * Example:
   * STUDIO
   */
  @Column({
    name: 'account_type',
    type: 'varchar',
    length: 30,
    comment: 'Business account type such as STUDIO, FREELANCER, PRINT_PARTNER.',
  })
  accountType!: string;

  /**
   * Display name of the business.
   *
   * Example:
   * PixelCraft Studio
   */
  @Column({
    name: 'account_name',
    type: 'varchar',
    length: 255,
    comment: 'Display name of the studio or organization.',
  })
  accountName!: string;

  /**
   * Primary owner user from iam.app_user.
   *
   * Example:
   * b3b95fc2-71e4-45d2-b3d2-7c38f59753ab
   */
  @Column({
    name: 'owner_user_id',
    type: 'uuid',
    comment: 'Primary owner user reference from iam.app_user.',
  })
  ownerUserId!: string;

  /**
   * Registered legal business name.
   *
   * Example:
   * PixelCraft Studios Private Limited
   */
  @Column({
    name: 'legal_name',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Registered business name.',
  })
  legalName?: string;

  /**
   * GST registration number.
   *
   * Example:
   * 21ABCDE1234F1Z5
   */
  @Column({
    name: 'gst_number',
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'GST registration number for billing purposes.',
  })
  gstNumber?: string;

  /**
   * Official business email.
   *
   * Example:
   * hello@pixelcraft.in
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Official business email address.',
  })
  email?: string;

  /**
   * Official business contact number.
   *
   * Example:
   * +91-9876543210
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Official business contact number.',
  })
  phone?: string;

  /**
   * Official business website.
   *
   * Example:
   * https://www.pixelcraft.in
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Business website URL.',
  })
  website?: string;

  /**
   * Current account status.
   *
   * Values:
   * 1 = Active
   * 0 = Inactive
   *
   * Example:
   * 1
   */
  @Column({
    type: 'smallint',
    default: 1,
    comment: 'Current account status such as ACTIVE or INACTIVE.',
  })
  status!: AccountStatus;

  /**
   * Initial onboarding fee charged to the partner.
   *
   * Example:
   * 5000.00
   */
  @Column({
    name: 'onboarding_fee',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Initial onboarding charge paid by partner.',
  })
  onboardingFee!: string;

  /**
   * Default commission percentage.
   *
   * Example:
   * 10.00
   */
  @Column({
    name: 'commission_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 10,
    comment: 'Default commission percentage per project.',
  })
  commissionPercentage!: string;

  /**
   * Record creation timestamp.
   *
   * Example:
   * 2026-07-18T10:30:45Z
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: 'Record creation timestamp.',
  })
  createdAt!: Date;

  /**
   * User who created the record.
   *
   * Example:
   * 8b2391da-2b84-41dc-91f4-efc3a84bc912
   */
  @Column({
    name: 'created_by',
    type: 'uuid',
    comment: 'User who created the record.',
  })
  createdBy!: string;

  /**
   * Last modification timestamp.
   *
   * Example:
   * 2026-08-01T14:20:10Z
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Last modification timestamp.',
  })
  updatedAt?: Date;

  /**
   * User who last modified the record.
   *
   * Example:
   * 5f26c0b8-6d17-4d9b-91ba-41e2e4e0b563
   */
  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
    comment: 'User who last modified the record.',
  })
  updatedBy?: string;

  /**
   * Soft delete timestamp.
   *
   * Null indicates the record is active.
   *
   * Example:
   * 2026-12-10T16:15:22Z
   */
  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Soft delete timestamp.',
  })
  deletedAt?: Date;

  /**
   * User who soft deleted the record.
   *
   * Example:
   * 34ea4f8d-7dca-4b68-a40d-c52e7cf63316
   */
  @Column({
    name: 'deleted_by',
    type: 'uuid',
    nullable: true,
    comment: 'User who performed the soft delete.',
  })
  deletedBy?: string;
}
