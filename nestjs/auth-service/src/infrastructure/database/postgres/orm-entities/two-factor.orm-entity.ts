import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

// orm-entities/two-factor.orm-entity.ts
@Entity('two_factor')
export class TwoFactorOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'user_id', unique: true })
	userId: string;

	@Column()
	secret: string;

	@Column({ name: 'is_enabled', default: false })
	isEnabled: boolean;

	@Column({ name: 'verified_at', nullable: true })
	verifiedAt: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
