import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  schema: 'identity',
  name: 'user_device',
})
export class UserDeviceEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'device_id',
  })
  deviceId!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'device_type',
    length: 20,
  })
  deviceType!: string;

  @Column({
    name: 'device_unique_id',
    length: 255,
    unique: true,
  })
  deviceUniqueId!: string;

  @Column({
    name: 'fcm_token',
    type: 'text',
  })
  fcmToken!: string;

  @Column({
    name: 'app_version',
    nullable: true,
  })
  appVersion?: string;

  @Column({
    name: 'device_name',
    nullable: true,
  })
  deviceName?: string;

  @Column({
    default: 1,
  })
  status?: number;

  @Column({
    name: 'last_login_at',
    type: 'timestamptz',
    nullable: true,
  })
  lastLoginAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}