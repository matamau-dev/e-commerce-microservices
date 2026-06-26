import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('addresses')
@Index(['userId'])
@Index(['postalCode'])
@Index(['city', 'state'])
export class AddressOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ name: 'full_name', type: 'varchar', length: 255 })
	fullName!: string;

	@Column({ type: 'varchar', length: 20 })
	phone!: string;

	@Column({ type: 'varchar', length: 255 })
	street!: string;

	@Column({ name: 'external_number', type: 'varchar', length: 50 })
	externalNumber!: string;

	@Column({
		name: 'internal_number',
		type: 'varchar',
		length: 50,
		nullable: true,
	})
	internalNumber?: string;

	@Column({ type: 'varchar', length: 255 })
	neighborhood!: string;

	@Column({ type: 'varchar', length: 100 })
	city!: string;

	@Column({ type: 'varchar', length: 100 })
	state!: string;

	@Column({ name: 'postal_code', type: 'varchar', length: 10 })
	postalCode!: string;

	@Column({
		name: 'reference_notes',
		type: 'varchar',
		length: 500,
		nullable: true,
	})
	referenceNotes?: string;

	@Column({ name: 'is_default', type: 'boolean', default: false })
	isDefault!: boolean;

	@Column({ type: 'uuid', name: 'user_id' })
	userId!: string;

	@ManyToOne(() => UserOrmEntity, (user) => user.addresses, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user!: UserOrmEntity;

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt!: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt!: Date;

	@DeleteDateColumn({
		name: 'deleted_at',
		type: 'timestamp',
		nullable: true,
	})
	deletedAt?: Date;
}
