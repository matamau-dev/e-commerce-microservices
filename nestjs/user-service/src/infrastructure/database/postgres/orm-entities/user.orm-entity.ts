import { RoleEnum } from '../../../../domain/enums/role.enum';

import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ length: 100 })
	name!: string;

	@Column({ unique: true, length: 150 })
	email!: string;

	@Column({ unique: true, length: 150 })
	phone!: string;

	@Column()
	password!: string;

	@Column({ default: true })
	is_active!: boolean;

	@Column({type:"enum",enum:RoleEnum, default: RoleEnum.COMPRADOR})
	role!: RoleEnum;

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
