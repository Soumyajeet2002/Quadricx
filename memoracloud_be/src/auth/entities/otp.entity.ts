import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({
  name: 'otp_logs',
  schema: 'identity',
})
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobile: string;

  @Column()
  otp: string;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
