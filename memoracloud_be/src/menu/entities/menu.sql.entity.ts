import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'menu_master',
  schema: 'identity',
})
export class MenuSqlEntity {
  @PrimaryGeneratedColumn('uuid')
  menu_unq_id: string;

  @Column({ type: 'bigint', unique: true })
  menu_code: number;

  @Column({ type: 'varchar', length: 200 })
  menu_name: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  menu_desc?: string;

  @Column({ type: 'bigint', nullable: true })
  parent_menu?: string;

  @Column({ type: 'int', default: 1 })
  menu_level: number;

  @Column({ type: 'int', default: 1 })
  menu_seq: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  menu_url?: string;

  @Column({ type: 'text', nullable: true }) // Base64 data
  menu_icon?: string;

  @Column({ nullable: true })
  created_by?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by?: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'smallint', default: 1 }) // 0=Inactive,1=Active,2=Deleted
  status: number;

   @Column({ type: 'smallint', default: 0 }) //newly added , requested by FE team 
  menu_type: number;
}
