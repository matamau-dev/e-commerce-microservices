import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

// orm-entities/login-attempt.orm-entity.ts
@Entity('login_attempts')
export class LoginAttemptOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'user_id', nullable: true })
	userId: string;

	@Column()
	email: string;

	@Column()
	success: boolean;

	@Column({ name: 'ip_address', nullable: true })
	ipAddress: string;

	@Column({ name: 'device_info', nullable: true })
	deviceInfo: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
