// infrastructure/database/postgres/orm-entities/profile-image.orm-entity.ts
import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('files')
export class FilesOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column()
	url!: string;

	@Column({ name: 'name_original' })
	nameOriginal!: string;

	@Column({ name: 'type_file' })
	typeFile!: string;

	@Column({ type: 'uuid', name: 'user_id' })
	userId;

	@OneToOne(() => UserOrmEntity, (user) => user.profileImages)
	@JoinColumn({ name: 'user_id' })
	user!: UserOrmEntity;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;
}
