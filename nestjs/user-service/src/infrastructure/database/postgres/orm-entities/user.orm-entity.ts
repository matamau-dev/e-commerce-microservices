import { RoleEnum } from '../../../../domain/enums/role.enum';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { FilesOrmEntity } from './file.orm-entity';
import { AddressOrmEntity } from './address.orm-entity';
import { WishlistOrmEntity } from './whislist/wishlist.orm-entity';

@Entity('users')
@Index(['email'])
@Index(['phone'])
@Index(['role'])
@Index(['isActive'])
@Index(['createdAt'])
export class UserOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ length: 100 })
	name!: string;

	@Column({ length: 150 })
	email!: string;

	@Column({ length: 20 })
	phone!: string;

	@Column({ select: false })
	password!: string;

	@Column({ name: 'is_active', default: true })
	isActive!: boolean;

	@Column({
		type: 'enum',
		enum: RoleEnum,
		default: RoleEnum.CLIENTE,
	})
	role!: RoleEnum;

	@OneToOne(() => FilesOrmEntity, (profile) => profile.user, {
		onDelete: 'SET NULL',
	})
	profileImages?: FilesOrmEntity;

	@OneToMany(() => AddressOrmEntity, (address) => address.user)
	addresses!: AddressOrmEntity[];

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
