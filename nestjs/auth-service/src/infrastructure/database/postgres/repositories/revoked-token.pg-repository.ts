import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import {
	RevokedTokenReader,
	RevokedTokenWriter,
} from 'src/domain/repositories/revoked-token.repository';
import { RevokedTokenOrmEntity } from '../orm-entities/revoked-token.orm-entity';
import { Repository } from 'typeorm';
import type { HashService } from 'src/domain/service/hash.service';
import { RevokedToken } from 'src/domain/entities/revoked-token.entity';

// repositories/revoked-token.pg-repository.ts
export class RevokedTokenPgRepository
	implements RevokedTokenReader, RevokedTokenWriter {
	constructor(
		@InjectRepository(RevokedTokenOrmEntity)
		private readonly orm: Repository<RevokedTokenOrmEntity>,
		@Inject('HashService')
		private readonly argonService: HashService,
	) { }

	async existsByToken(token: string): Promise<boolean> {
		// Busca todos los tokens no expirados y compara con argon2
		// No puedes usar WHERE directo porque el token está hasheado
		const active = await this.orm
			.createQueryBuilder('rt')
			.where('rt.expires_at > :now', { now: new Date() })
			.getMany();

		for (const record of active) {
			const match = await this.argonService.compare(record.token, token);
			if (match) return true;
		}
		return false;
	}

	async create(revokedToken: RevokedToken): Promise<void> {
		await this.orm.save({
			id: revokedToken.id,
			userId: revokedToken.userId,
			token: revokedToken.token,
			expiresAt: revokedToken.expiresAt,
		});
	}

	async deleteExpired(): Promise<void> {
		await this.orm
			.createQueryBuilder()
			.delete()
			.where('expires_at < :now', { now: new Date() })
			.execute();
	}
}
