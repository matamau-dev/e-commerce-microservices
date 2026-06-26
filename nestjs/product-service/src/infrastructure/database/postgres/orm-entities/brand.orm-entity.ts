import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('brands')
export class BrandOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column()
	brand!: string;

	@Column({ nullable: false, unique: true })
	slug!: string;

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		select: true,
	})
	created_at!: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		select: false,
	})
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
	deleted_at?: Date;
}
