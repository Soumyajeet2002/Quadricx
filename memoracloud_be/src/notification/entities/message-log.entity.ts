import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'identity', name: 'message_logs' })

export class MessageLog {

    @PrimaryGeneratedColumn('uuid')

    id!: string;

    @Column({ name: 'organization_id', type: 'uuid', nullable: true })

    organizationId?: string;

    @Column({ name: 'module_name', type: 'varchar', length: 100, nullable: true })

    moduleName?: string;

    @Column({ name: 'reference_id', type: 'uuid', nullable: true })

    referenceId?: string;

    @Column({ name: 'recipient_id', type: 'uuid', nullable: true })

    recipientId?: string;

    @Column({ name: 'recipient_name', type: 'varchar', length: 150, nullable: true })

    recipientName?: string;

    @Column({ name: 'recipient_type', type: 'varchar', length: 50, nullable: true })

    recipientType?: string;

    @Column({ name: 'notification_type', type: 'varchar', length: 20 })

    notificationType!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })

    title?: string;

    @Column({ type: 'text' })

    message!: string;

    @Column({ name: 'device_token', type: 'text', nullable: true })

    deviceToken?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })

    email?: string;

    @Column({ name: 'mobile_number', type: 'varchar', length: 20, nullable: true })

    mobileNumber?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })

    provider?: string;

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })

    status!: string;

    @Column({ name: 'provider_message_id', type: 'varchar', length: 255, nullable: true })

    providerMessageId?: string;

    @Column({ name: 'error_code', type: 'varchar', length: 100, nullable: true })

    errorCode?: string;

    @Column({ name: 'error_message', type: 'text', nullable: true })

    errorMessage?: string;

    @Column({ type: 'jsonb', nullable: true })

    payload?: Record<string, any>;

    @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })

    sentAt?: Date;

    @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })

    deliveredAt?: Date;

    @Column({ name: 'read_at', type: 'timestamptz', nullable: true })

    readAt?: Date;

    @Column({ name: 'created_by', type: 'uuid', nullable: true })

    createdBy?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })

    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamptz', nullable: true })

    updatedAt?: Date;

}