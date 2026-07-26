import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCKED = 2,
}

@Entity({ schema: 'crm', name: 'customer' })
@Index('idx_customer_code', ['customerCode'], { unique: true })
@Index('idx_customer_active', ['customerCode'], { where: 'deleted_at IS NULL' })
@Index('idx_customer_created_at', ['createdAt'])
@Index('idx_customer_email', ['email'])
@Index('idx_customer_name', ['fullName'])
@Index('idx_customer_phone', ['phone'])
@Index('idx_customer_status', ['status'])
@Index('idx_customer_search', ['status', 'fullName'])
@Index('idx_customer_user', ['userId'])
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Internal UUID primary key.',
  })
  id!: string;

  @Column({
    name: 'customer_code',
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Human-readable unique customer identifier. Example: CLI000001.',
  })
  customerCode!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
    comment: 'Optional reference to IAM user when the customer has portal login access.',
  })
  userId?: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 150,
    comment: 'Full name of the customer.',
  })
  fullName!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
    comment: 'Primary email address used for communication and login.',
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
    comment: 'Primary mobile number of the customer.',
  })
  phone?: string;

  @Column({
    type: 'smallint',
    default: 1,
    comment: 'Current customer status. Allowed values: ACTIVE(1), INACTIVE(0), BLOCKED(2).',
  })
  status!: CustomerStatus;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
    comment: 'User who created the customer record.',
  })
  createdBy?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: 'Record creation timestamp.',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
    comment: 'User who last updated the record.',
  })
  updatedBy?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Last modification timestamp.',
  })
  updatedAt?: Date;

  @Column({
    name: 'deleted_by',
    type: 'uuid',
    nullable: true,
    comment: 'User who performed the soft delete operation.',
  })
  deletedBy?: string;

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Soft delete timestamp. NULL indicates the record is active.',
  })
  deletedAt?: Date;
}
