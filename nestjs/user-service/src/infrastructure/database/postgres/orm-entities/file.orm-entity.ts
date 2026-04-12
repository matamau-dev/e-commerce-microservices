// infrastructure/database/postgres/orm-entities/profile-image.orm-entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('files')
export class FilesOrmEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	url!: string;

	@Column({ name: 'name_original' })
	nameOriginal!: string;

	@Column({ name: 'type_file' })
	typeFile!: string;

	@Column({ name: 'user_id' })
	userId!: string;

	@OneToOne(() => UserOrmEntity, (user) => user.profileImages)
	user!: UserOrmEntity;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;
}
