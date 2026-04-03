import { InjectRepository } from '@nestjs/typeorm';
import {
	LoginAttemptReader,
	LoginAttemptWriter,
} from 'src/domain/repositories/login-attempt.repository';
import { LoginAttemptOrmEntity } from '../orm-entities/login-attempt.orm-entity';
import { Repository } from 'typeorm';
import { LoginAttempt } from 'src/domain/entities/login-attempt.entity';
import { Email } from 'src/domain/value-objects/email_or_user_name.value-object';

// repositories/login-attempt.pg-repository.ts
export class LoginAttemptPgRepository
	implements LoginAttemptReader, LoginAttemptWriter
{
	constructor(
		@InjectRepository(LoginAttemptOrmEntity)
		private readonly orm: Repository<LoginAttemptOrmEntity>,
	) {}

	async create(attempt: LoginAttempt): Promise<void> {
		const saved = await this.orm.save(this.toOrm(attempt));
	}

	async countRecentFailedByEmail(
		email: string,
		sinceMinutes: number,
	): Promise<number> {
		const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
		return this.orm
			.createQueryBuilder('la')
			.where('la.email = :email', { email })
			.andWhere('la.success = :success', { success: false })
			.andWhere('la.created_at > :since', { since })
			.getCount();
	}

	private toDomain(orm: LoginAttemptOrmEntity): LoginAttempt {
		const email = new Email(orm.email);
		const attempt = new LoginAttempt();
		attempt.id = orm.id;
		attempt.userId = orm.userId;
		attempt.email = email;
		attempt.success = orm.success;
		attempt.ipAddress = orm.ipAddress;
		attempt.deviceInfo = orm.deviceInfo;
		attempt.createdAt = orm.createdAt;
		return attempt;
	}

	private toOrm(attempt: LoginAttempt): Partial<LoginAttemptOrmEntity> {
		return {
			id: attempt.id,
			userId: attempt.userId,
			email: attempt.email.getValue(),
			success: attempt.success,
			ipAddress: attempt.ipAddress,
			deviceInfo: attempt.deviceInfo,
		};
	}
}
