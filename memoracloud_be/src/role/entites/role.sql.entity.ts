import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'roles',
  schema: 'identity',
})
export class RoleSqlEntity {
  @PrimaryGeneratedColumn('uuid')
  role_unq_id: string;

  @Column({ type: 'int', unique: true })
  role_code: number;

  @Column({ unique: true })
  role_name: string;

  @Column({ default: 1 })
  status: number; // 0=Inactive,1=Active,2=Delete

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  updated_by: string;

  @UpdateDateColumn()
  updated_at: Date;
}
