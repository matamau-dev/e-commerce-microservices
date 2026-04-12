import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user/user.entity';
import {
	UserReader,
	UserVerification,
	UserWriter,
} from 'src/domain/repositories/user/user.repository';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { Repository } from 'typeorm';
import { Email } from 'src/domain/value-objects/email.value-object';
import { Phone } from 'src/domain/value-objects/phone.value-object';

export class UserPgRepository
	implements UserReader, UserWriter, UserVerification
{
	constructor(
		@InjectRepository(UserOrmEntity)
		private readonly orm: Repository<UserOrmEntity>,
	) {}

	async findById(id: string): Promise<User | null> {
		const found = await this.orm.findOne({ where: { id } });
		return found ? this.toDomain(found) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const found = await this.orm.findOne({ where: { email } });

		return found ? this.toDomain(found) : null;
	}

	async existsByEmail(email: string): Promise<boolean> {
		return this.orm.existsBy({ email });
	}

	async existsByPhone(phone: string): Promise<boolean> {
		return this.orm.existsBy({ phone });
	}

	async create(user: User): Promise<User> {
		const saved = await this.orm.save(this.toOrm(user));
		return this.toDomain(saved);
	}

	async update(user: User): Promise<User> {
		const updated = await this.orm.save(this.toOrm(user));
		return this.toDomain(updated);
	}

	async softDelete(id: string): Promise<void> {
		await this.orm.softDelete({ id });
	}

	async permanentDelete(id: string): Promise<void> {
		await this.orm.delete(id);
	}

	async existByEmail(email: string): Promise<boolean> {
		return await this.orm.existsBy({ email });
	}
	async existByPhone(phone: string): Promise<boolean> {
		return await this.orm.existsBy({ phone });
	}

	// ORM Entity → Domain Entity
	private toDomain(orm: UserOrmEntity): User {
		const user = new User();
		user.id = orm.id;
		user.name = orm.name;
		user.email = new Email(orm.email);
		user.phone = new Phone(orm.phone);
		user.role = orm.role;
		user.password = orm.password;
		user.isActive = orm.is_active;
		user.createdAt = orm.created_at;
		user.deletedAt = orm.deleted_at;
		return user;
	}

	private toOrm(user: User): Partial<UserOrmEntity> {
		return {
			id: user.id,
			name: user.name,
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			password: user.password,
			role: user.role,
			is_active: user.isActive,
			deleted_at: user.deletedAt,
		};
	}
}
