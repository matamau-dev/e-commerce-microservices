// orm-entities/session.orm-entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'role' })
	role: string;

	@Column({ name: 'refresh_token' })
	refreshToken: string;

	@Column({ name: 'device_info', nullable: true })
	deviceInfo: string;

	@Column({ name: 'ip_address', nullable: true })
	ipAddress: string;

	@Column({ name: 'expires_at' })
	expiresAt: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
