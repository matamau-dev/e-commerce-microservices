import { InjectRepository } from '@nestjs/typeorm';
import {
	SessionReader,
	SessionWriter,
} from 'src/domain/repositories/session.repository';
import { SessionOrmEntity } from '../orm-entities/session.orm-entity';
import { Repository } from 'typeorm';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Session } from 'src/domain/entities/session.entity';

export class SessionPgRepository implements SessionReader, SessionWriter {
	constructor(
		@InjectRepository(SessionOrmEntity)
		private readonly orm: Repository<SessionOrmEntity>,
	) {}

	async findAllByUserId(userId: string): Promise<Session[]> {
		const found = await this.orm.find({ where: { userId } });
		return found.map((s) => this.toDomain(s));
	}

	async create(session: Session): Promise<Session> {
		const saved = await this.orm.save(this.toOrm(session));
		return this.toDomain(saved);
	}

	async delete(id: string): Promise<void> {
		await this.orm.delete(id);
	}

	async deleteAllByUserId(userId: string): Promise<void> {
		await this.orm.delete({ userId });
	}

	private toDomain(orm: SessionOrmEntity): Session {
		const session = new Session();
		session.id = orm.id;
		session.userId = orm.userId;
		session.role = orm.role as RoleEnum;
		session.refreshToken = orm.refreshToken;
		session.deviceInfo = orm.deviceInfo;
		session.ipAddress = orm.ipAddress;
		session.expiresAt = orm.expiresAt;
		session.createdAt = orm.createdAt;
		return session;
	}

	private toOrm(session: Session): Partial<SessionOrmEntity> {
		return {
			id: session.id,
			userId: session.userId,
			role: session.role,
			refreshToken: session.refreshToken,
			deviceInfo: session.deviceInfo,
			ipAddress: session.ipAddress,
			expiresAt: session.expiresAt,
		};
	}
}
