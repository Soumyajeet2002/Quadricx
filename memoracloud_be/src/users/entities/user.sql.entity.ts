import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleSqlEntity } from 'src/role/entites/role.sql.entity';

@Entity({
  schema: 'identity',
  name: 'users',
})
export class UserSqlEntity {
  // ==========================================================
  // Primary Key
  // ==========================================================
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ==========================================================
  // Mobile Number
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
  })
  mobile?: string;

  // ==========================================================
  // Full Name
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name?: string;

  // ==========================================================
  // Email
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: true,
  })
  email!: string;

  // ==========================================================
  // Password Hash
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password_hash!: string;

  // ==========================================================
  // Role UUID
  // ==========================================================
  @Column({
    type: 'uuid',
    nullable: true,
  })
  role_unq_id?: string;

  // ==========================================================
  // Role Relation (No DB Foreign Key)
  // ==========================================================
  @ManyToOne(() => RoleSqlEntity, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'role_unq_id',
  })
  role?: RoleSqlEntity;

  // ==========================================================
  // Status
  // ==========================================================
  @Column({
    type: 'smallint',
    default: 1,
  })
  status!: number;

  // ==========================================================
  // Refresh Token Hash
  // ==========================================================
  @Column({
    type: 'text',
    nullable: true,
  })
  refresh_token_hash?: string | null;

  // ==========================================================
  // Created By
  // ==========================================================
  @Column({
    type: 'uuid',
    nullable: true,
  })
  created_by?: string;

  // ==========================================================
  // Created At
  // ==========================================================
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  // ==========================================================
  // Updated By
  // ==========================================================
  @Column({
    type: 'uuid',
    nullable: true,
  })
  updated_by?: string;

  // ==========================================================
  // Updated At
  // ==========================================================
  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  updated_at?: Date;
}