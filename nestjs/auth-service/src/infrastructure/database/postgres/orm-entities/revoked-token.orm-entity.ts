import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

// orm-entities/revoked-token.orm-entity.ts
@Entity('revoked_tokens')
export class RevokedTokenOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ type: 'text' })
	token: string; // access token hasheado — puede ser largo

	@Column({ name: 'expires_at' })
	expiresAt: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
