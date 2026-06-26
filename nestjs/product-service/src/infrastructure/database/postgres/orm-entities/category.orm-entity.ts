import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
@Index(['category'])
export class CategoryOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column()
	category!: string;

	@Column({ nullable: false, unique: true })
	slug!: string;

	@Column({ name: 'parent_id', type: 'uuid', nullable: true })
	parentId?: string;

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
