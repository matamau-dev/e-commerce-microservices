import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user/user.entity';
import {
	UserReader,
	UserVerification,
	UserWriter,
} from 'src/domain/repositories/user/user.repository';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { Repository } from 'typeorm';

import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { UserMapper } from 'src/infrastructure/mappers/user.maper';

export class UserPgRepository
	implements UserReader, UserWriter, UserVerification
{
	constructor(
		@InjectRepository(UserOrmEntity)
		private readonly orm: Repository<UserOrmEntity>,
	) {}

	async findById(id: string): Promise<User | null> {
		const found = await this.orm.findOne({
			where: { id },
			relations: { profileImages: true },
			select: {},
		});
		return found ? UserMapper.UserOrmToUserDomain(found) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const found = await this.orm.findOne({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				role: true,
				isActive: true,
			},
		});
		return found ? UserMapper.UserOrmToUserDomain(found) : null;
	}

	async existsByEmail(email: string): Promise<boolean> {
		return this.orm.existsBy({ email });
	}

	async existsByPhone(phone: string): Promise<boolean> {
		return this.orm.existsBy({ phone });
	}

	async create(user: User): Promise<User> {
		const saved = await this.orm.save(UserMapper.UserDomainToUserORM(user));
		return UserMapper.UserOrmToUserDomain(saved);
	}

	async update(user: User): Promise<User> {
		const updated = await this.orm.save(
			UserMapper.UserDomainToUserORM(user),
		);
		return UserMapper.UserOrmToUserDomain(updated);
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
}
